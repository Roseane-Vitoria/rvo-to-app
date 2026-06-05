@echo off
chcp 65001 > nul
echo ====================================================================
echo  🚀 Enviando RvoToApp para o GitHub (Roseane-Vitoria/rvo-to-app)
echo ====================================================================
echo.
echo PASSO 1: Certifique-se de ter criado o repositório no seu GitHub.
echo Acesse: https://github.com/new e crie um repositório vazio com o nome: rvo-to-app
echo.
echo PASSO 2: Pressione qualquer tecla após criar o repositório no GitHub para iniciar o push...
pause > nul
echo.
echo Enviando arquivos... (Será aberta uma janela para você autorizar o acesso no seu navegador)
"..\..\.gemini\antigravity\scratch\git\cmd\git.exe" push -u origin main
echo.
if %errorlevel% equ 0 (
    echo.
    echo 🎉 Código enviado com sucesso para https://github.com/Roseane-Vitoria/rvo-to-app !
) else (
    echo.
    echo ❌ Ocorreu um erro ao enviar. Verifique se o repositório foi criado e se a autenticação foi concluída.
)
echo.
echo Pressione qualquer tecla para fechar esta janela.
pause > nul
