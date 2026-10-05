@echo off
chcp 65001 > nul
echo ========================================================
echo    DỰ ÁN GAME GIÁO DỤC TRẺ EM - HUGGING FACE DEPLOYER
echo ========================================================
echo.

echo [1/3] Đang đóng gói phiên bản mới nhất (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [LỖI] Đóng gói thất bại. Vui lòng kiểm tra lại mã nguồn!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Chuẩn bị thư mục đồng bộ Hugging Face Space...
set HF_DIR=..\hf-tri-tue

if not exist "%HF_DIR%" (
    echo Đang clone repository Hugging Face về máy...
    git clone https://huggingface.co/spaces/kids-edu-game/tri-tue "%HF_DIR%"
)

echo.
echo [3/3] Đang sao chép file dist vào thư mục Hugging Face...
robocopy "dist" "%HF_DIR%" /E /NFL /NDL /NJH /NJS /nc /ns /np

echo.
echo ========================================================
echo [HOÀN TẤT] File đã sẵn sàng tại: %HF_DIR%
echo.
echo Để đẩy lên Hugging Face, hãy chạy 3 lệnh sau:
echo   cd %HF_DIR%
echo   git add .
echo   git commit -m "Deploy Kids Edu Game"
echo   git push
echo.
echo (Lưu ý: Mật khẩu khi git push là Hugging Face User Access Token của bạn)
echo ========================================================
pause
