@echo off
setlocal

:: Caminho base do site
set "SITE=D:\OneDrive\GitHub\PETEQFURG\site-pet-raiz\assets\img\galeria"

:: Caminho base do acervo (OneDrive-FURG)
set "ACERVO=D:\OneDrive-FURG\FURG - Universidade Federal do Rio Grande\PET EQ - Acervo Fotos PET EQ"

:: Garante que a pasta de destino exista
if not exist "%SITE%" mkdir "%SITE%"

:: Função para criar links simbólicos
call :CreateLink "1_Ensino"               "%ACERVO%\1. Ensino"
call :CreateLink "2_Pesquisa"             "%ACERVO%\2. Pesquisa"
call :CreateLink "3_Extensao"             "%ACERVO%\3. Extensao"
call :CreateLink "4_Inovacao_Tecnologia"  "%ACERVO%\4. Inovacao_Tecnologia"
call :CreateLink "5_Desenvolvimento_Pessoal" "%ACERVO%\5. Desenvolvimento Pessoal"
call :CreateLink "6_Gestao_Avaliacao"     "%ACERVO%\6. Gestao_Avaliacao"

echo.
echo ===== FIM DO PROCESSO =====
pause
exit /b

:CreateLink
set "LINK=%SITE%\%~1"
set "SRC=%~2"

echo.
echo Criando link: %LINK%
if exist "%LINK%" (
  echo Removendo link antigo...
  rmdir "%LINK%"
)

mklink /D "%LINK%" "%SRC%"
if exist "%LINK%" (
  echo OK: Link criado com sucesso para %~1
) else (
  echo ERRO: Nao foi possivel criar o link para %~1
)
exit /b
