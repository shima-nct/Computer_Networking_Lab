winget install --id Microsoft.VisualStudioCode

winget install --id Git.Git

# https://www.powershellgallery.com/packages/ps-copyid/1.1.0
Install-Module -Name ps-copyid

# WSLでインストール可能なLinuxディストリビューションを確認
wsl --list --online

wsl --install -d Ubuntu-24.04