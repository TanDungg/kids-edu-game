import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import WorldMap from "./components/WorldMap";
import LanguageValley from "./components/LanguageValley";
import MathFarm from "./components/MathFarm";
import LogicTower from "./components/LogicTower";
import PetSanctuary from "./components/PetSanctuary";
import ParentModal from "./components/ParentModal";
import AdminDashboard from "./components/AdminDashboard";
import AuthModal from "./components/AuthModal";
import UserProfileModal from "./components/UserProfileModal";
import { dataManager } from "./services/dataManager";
import { sounds } from "./utils/sound";
import { supabaseService } from "./services/supabase";

// Helper đọc màn hình từ URL hash hoặc localStorage để giữ nguyên trang khi F5
function getScreenFromHash() {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    const validScreens = ['map', 'language', 'math', 'logic', 'pet', 'admin'];
    if (validScreens.includes(hash)) {
      return hash;
    }
  } catch {}
  return localStorage.getItem('kids_last_screen') || 'map';
}

function updateHashForScreen(screen) {
  try {
    const targetHash = screen === 'map' ? '' : `#/${screen}`;
    if (window.location.hash !== targetHash) {
      if (!targetHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        history.replaceState(null, '', targetHash);
      }
    }
    localStorage.setItem('kids_last_screen', screen);
  } catch {}
}

const DEFAULT_PROGRESS = {
  stars: 5,
  coins: 30,
  level: 1,
  pet: {
    id: "cat",
    name: "Bé Miu Miu",
    emoji: "🐱",
    sound: "Meo meo~",
    hunger: 80,
    happiness: 90,
  },
  stats: {
    language: { completed: 0, correct: 0 },
    math: { completed: 0, correct: 0 },
    logic: { completed: 0, correct: 0 },
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(() => getScreenFromHash());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [stars, setStars] = useState(() => {
    return parseInt(localStorage.getItem("kids_stars") || String(DEFAULT_PROGRESS.stars), 10);
  });
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem("kids_coins") || String(DEFAULT_PROGRESS.coins), 10);
  });
  const [level, setLevel] = useState(() => {
    return parseInt(localStorage.getItem("kids_level") || String(DEFAULT_PROGRESS.level), 10);
  });
  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem("kids_pet");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const pets = dataManager.getPets();
    return pets && pets.length > 0 ? pets[0] : DEFAULT_PROGRESS.pet;
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("kids_stats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_PROGRESS.stats;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Phân quyền: Tài khoản admin bao gồm email chứa 'admin', tài khoản tandung230698@gmail.com, hoặc role 'admin'
  const isAdmin = Boolean(
    currentUser &&
    (currentUser.email?.toLowerCase().includes("admin") ||
      currentUser.email === "tandung230698@gmail.com" ||
      currentUser.user_metadata?.role === "admin" ||
      currentUser.app_metadata?.role === "admin" ||
      currentUser.email === "admin@kidsedu.com"),
  );

  // Tải trạng thái xác thực và phiên đăng nhập khi khởi động
  useEffect(() => {
    supabaseService.getSession().then((session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadCloudProgress(session.user.id);
      } else {
        // Chưa đăng nhập -> reset về mặc định sạch
        applyDefaultProgress();
      }
      setIsAuthLoading(false);
    }).catch(() => {
      setIsAuthLoading(false);
    });

    const subscription = supabaseService.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        setCurrentUser(user);
        if (event === "SIGNED_IN" && user) {
          loadCloudProgress(user.id);
        } else if (event === "SIGNED_OUT") {
          applyDefaultProgress();
        }
      },
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // Lắng nghe thay đổi hash và phím Back/Forward của trình duyệt
  useEffect(() => {
    const handleHashOrPopState = () => {
      const screenFromUrl = getScreenFromHash();
      if (screenFromUrl && screenFromUrl !== currentScreen) {
        setCurrentScreen(screenFromUrl);
      }
    };
    window.addEventListener('hashchange', handleHashOrPopState);
    window.addEventListener('popstate', handleHashOrPopState);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPopState);
      window.removeEventListener('popstate', handleHashOrPopState);
    };
  }, [currentScreen]);

  // Đồng bộ URL hash mỗi khi currentScreen thay đổi
  useEffect(() => {
    updateHashForScreen(currentScreen);
  }, [currentScreen]);

  // Router Guard: Bảo vệ màn chơi và admin, chỉ kích hoạt khi đã xác thực xong (isAuthLoading === false)
  useEffect(() => {
    if (isAuthLoading) return;

    if (!currentUser && currentScreen !== "map") {
      setCurrentScreen("map");
      setIsAuthOpen(true);
      updateHashForScreen("map");
      return;
    }

    if (currentUser && currentScreen === "admin" && !isAdmin) {
      setCurrentScreen("map");
      updateHashForScreen("map");
    }
  }, [currentUser, currentScreen, isAuthLoading, isAdmin]);

  const applyDefaultProgress = () => {
    setStars(DEFAULT_PROGRESS.stars);
    setCoins(DEFAULT_PROGRESS.coins);
    setLevel(DEFAULT_PROGRESS.level);
    setPet(DEFAULT_PROGRESS.pet);
    setStats(DEFAULT_PROGRESS.stats);
    localStorage.removeItem("kids_stars");
    localStorage.removeItem("kids_coins");
    localStorage.removeItem("kids_level");
    localStorage.removeItem("kids_pet");
    localStorage.removeItem("kids_stats");
  };

  const loadCloudProgress = async (userId) => {
    if (!userId) return;
    try {
      const fullData = await supabaseService.fetchPlayerFullProgress(userId);
      if (fullData) {
        setStars(fullData.stars);
        setCoins(fullData.coins);
        setLevel(fullData.level);
        setPet(fullData.pet);
        setStats(fullData.stats);
      }
    } catch (e) {
      console.warn("Lỗi tải tiến độ đám mây:", e);
    }
  };

  // Sync to LocalStorage and directly to Supabase Cloud khi có người dùng đăng nhập
  useEffect(() => {
    if (isAuthLoading) return;

    localStorage.setItem("kids_stars", stars.toString());
    localStorage.setItem("kids_coins", coins.toString());
    localStorage.setItem("kids_level", level.toString());
    localStorage.setItem("kids_pet", JSON.stringify(pet));
    localStorage.setItem("kids_stats", JSON.stringify(stats));

    if (currentUser?.id) {
      supabaseService.syncCleanProgress({
        playerId: currentUser.id,
        stars,
        coins,
        level,
        pet,
        stats,
      });
    }
  }, [stars, coins, level, pet, stats, currentUser, isAuthLoading]);

  const handleLogout = async () => {
    await supabaseService.signOut();
    setCurrentUser(null);
    applyDefaultProgress();
    sounds.playClick();
  };

  const handleManualSync = () => {
    if (currentUser?.id) {
      supabaseService.syncCleanProgress({
        playerId: currentUser.id,
        stars,
        coins,
        level,
        pet,
        stats,
      });
    }
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleCompleteLevel = async (subject, result) => {
    if (result.correct) {
      const earnedStars = result.starsEarned || 1;
      const earnedCoins = result.coinsEarned || 15;

      const newStars = stars + earnedStars;
      const newCoins = coins + earnedCoins;
      const newLevel = Math.max(1, Math.floor(newStars / 3));

      setStars(newStars);
      setCoins(newCoins);
      setLevel(newLevel);

      const currentSub = stats[subject] || { completed: 0, correct: 0 };
      const newStats = {
        ...stats,
        [subject]: {
          completed: currentSub.completed + 1,
          correct: currentSub.correct + 1,
        },
      };
      setStats(newStats);

      // Ghi nhật ký học tập THẬT vào database Supabase learning_logs & cập nhật game_progress
      if (currentUser?.id) {
        await supabaseService.logActivity(subject, true, currentUser.id);
        await supabaseService.syncCleanProgress({
          playerId: currentUser.id,
          stars: newStars,
          coins: newCoins,
          level: newLevel,
          pet,
          stats: newStats,
        });
      }
    }
  };

  const handleSpendCoins = (amount) => {
    setCoins((prev) => Math.max(0, prev - amount));
  };

  const handleUpdatePet = (updatedPet) => {
    setPet(updatedPet);
  };

  const handleResetData = async () => {
    applyDefaultProgress();
    if (currentUser?.id) {
      await supabaseService.syncProgress(DEFAULT_PROGRESS, currentUser.id);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}
    >
      {/* Decorative Whimsical Floating Clouds (Hidden on mobile) */}
      <div
        className="cloud-bg animate-float hide-on-mobile"
        style={{ top: "80px", left: "5%", width: "140px", height: "45px" }}
      />
      <div
        className="cloud-bg animate-float hide-on-mobile"
        style={{
          top: "160px",
          right: "8%",
          width: "180px",
          height: "55px",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="cloud-bg animate-float hide-on-mobile"
        style={{
          top: "450px",
          left: "8%",
          width: "120px",
          height: "40px",
          animationDelay: "2.5s",
        }}
      />

      {/* Main Header */}
      <Header
        stars={stars}
        coins={coins}
        level={level}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenParent={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            return;
          }
          setIsParentOpen(true);
        }}
        onOpenAdmin={() => {
          if (!currentUser || !isAdmin) {
            setIsAuthOpen(true);
            return;
          }
          setCurrentScreen("admin");
        }}
        onGoHome={() => setCurrentScreen("map")}
        currentScreen={currentScreen}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Game Screen Router */}
      <main className="app-main-content">
        {currentScreen === "map" && (
          <WorldMap
            onSelectRealm={(realmId) => {
              if (!currentUser) {
                setIsAuthOpen(true);
                return;
              }
              setCurrentScreen(realmId);
            }}
            pet={pet}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentScreen === "language" && (
          <LanguageValley
            onBack={() => setCurrentScreen("map")}
            onCompleteLevel={handleCompleteLevel}
          />
        )}

        {currentScreen === "math" && (
          <MathFarm
            onBack={() => setCurrentScreen("map")}
            onCompleteLevel={handleCompleteLevel}
          />
        )}

        {currentScreen === "logic" && (
          <LogicTower
            onBack={() => setCurrentScreen("map")}
            onCompleteLevel={handleCompleteLevel}
          />
        )}

        {currentScreen === "pet" && (
          <PetSanctuary
            onBack={() => setCurrentScreen("map")}
            coins={coins}
            pet={pet}
            onUpdatePet={handleUpdatePet}
            onSpendCoins={handleSpendCoins}
          />
        )}

        {currentScreen === "admin" &&
          (isAdmin ? (
            <AdminDashboard
              onBack={() => setCurrentScreen("map")}
              playerData={{ stars, coins, level, pet, stats }}
              onUpdatePlayerData={({
                stars: newStars,
                coins: newCoins,
                level: newLevel,
                pet: newPet,
                stats: newStats,
              }) => {
                if (newStars !== undefined) setStars(newStars);
                if (newCoins !== undefined) setCoins(newCoins);
                if (newLevel !== undefined) setLevel(newLevel);
                if (newPet !== undefined) setPet(newPet);
                if (newStats !== undefined) setStats(newStats);
              }}
              onResetAllData={handleResetData}
            />
          ) : (
            <div
              style={{
                maxWidth: "540px",
                margin: "60px auto",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div
                className="kid-card"
                style={{
                  padding: "36px",
                  background: "#ffffff",
                  borderRadius: "24px",
                }}
              >
                <div style={{ fontSize: "54px", marginBottom: "12px" }}>🔒</div>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#dc2626",
                    marginBottom: "8px",
                  }}
                >
                  Khu Vực Quản Trị Giới Hạn
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    marginBottom: "24px",
                    lineHeight: 1.6,
                  }}
                >
                  Trang quản trị chỉ dành riêng cho tài khoản Quản trị viên
                  (Admin). Người dùng bình thường không thể truy cập khu vực
                  này.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setCurrentScreen("map")}
                    className="btn-kid btn-blue"
                    style={{ padding: "10px 22px" }}
                  >
                    Quay lại Bản đồ
                  </button>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="btn-kid btn-purple"
                    style={{ padding: "10px 22px" }}
                  >
                    Đăng nhập Admin
                  </button>
                </div>
              </div>
            </div>
          ))}
      </main>

      {/* Parent Modal Gate - Chỉ mở khi đã đăng nhập */}
      {currentUser && (
        <ParentModal
          isOpen={isParentOpen}
          onClose={() => setIsParentOpen(false)}
          stats={stats}
          stars={stars}
          coins={coins}
          level={level}
          pet={pet}
          onResetData={handleResetData}
        />
      )}

      {/* Auth Modal (Sign in / Sign up / Google OAuth) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadCloudProgress(user.id);
        }}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        stars={stars}
        coins={coins}
        level={level}
        pet={pet}
        isAdmin={isAdmin}
        onOpenAdmin={() => {
          setIsProfileOpen(false);
          setCurrentScreen("admin");
        }}
        onOpenParent={() => {
          setIsProfileOpen(false);
          setIsParentOpen(true);
        }}
        onLogout={handleLogout}
        onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
      />
    </div>
  );
}
