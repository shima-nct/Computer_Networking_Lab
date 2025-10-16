# 前提条件

Windows 11 上で WSL2（例：Ubuntu 24.04）がインストール済み

管理者権限がある

PCは有線LAN or Wi-Fi でルータ／スイッチ配下に接続

LANセグメント例

ゲートウェイ（ルータ）：192.168.60.1

Windowsホスト：192.168.60.10

予定するWSL固定IP：192.168.60.50（同一セグメント内・未使用）

① WSL で Web サーバーを用意

まずWSL(Ubuntu)で任意の静的コンテンツ用ディレクトリを作り、簡単なHTTPサーバを起動します。

# インストールできるLinuxの一覧
```
wsl --list --online

```

# インストール
```
wsl --install -d Ubuntu-24.04
```


# Ubuntu (WSL) 側
```
cd ~
mkdir -p www
echo "Hello from WSL2 Static Server" > www/index.html

# ポート8000で起動（例：Python）
cd www
python3 -m http.server 8000
```

ローカルで http://localhost:8000 にアクセスして表示できればOKです。

# WSL 側の IP を固定する（同一L2ネットワーク内で）

WSL2 の標準ネットワークはNATで、毎回IPが変わります。
以下の手順で、「Hyper-V 仮想スイッチ」経由でLANに直接参加する設定をします。

1. Windows 側で仮想スイッチを作成

PowerShell（管理者）で実行：

2. WSL のネットワーク設定を開く

```
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All, VirtualMachinePlatform
New-VMSwitch -Name "WSLBridge" -NetAdapterName "Ethernet" -AllowManagementOS $true

```

物理NIC名を確認（有線なら "Ethernet"、無線なら "Wi-Fi" など）
```
Get-NetAdapter | ? Status -eq Up | ft Name, IfIndex, Status
```


Hyper-V 外部スイッチを作成（WSLBridge という名前で作るのがポイント）

有線にぶら下げる例:
```
New-VMSwitch -Name "WSLBridge" -NetAdapterName "Ethernet" -AllowManagementOS $true
```

%USERPROFILE%\.wslconfig を作成または編集して、以下を追記：

[wsl2]
networkingMode=bridged
vmSwitch=WSLBridge
```

networkingMode=bridged により、WSL VM がホストと同一L2ネットワークに直結されます。

その後WSLを再起動：
```
wsl --shutdown
wsl
```

3. WSL 側で固定IPを割り当て

Ubuntu (WSL) 側で netplan または systemd-networkd を使って静的IPを設定します。
最近のUbuntu 24.04では /etc/systemd/network/eth0.network が多いです。
```
sudo mkdir -p /etc/systemd/network
sudo nano /etc/systemd/network/eth0.network
```

内容例：
```
[Match]
Name=eth0

[Network]
Address=192.168.21.10/24
Gateway=192.168.21.1
DNS=192.168.21.1
```

適用して再起動：
```
sudo systemctl restart systemd-networkd
ip addr show eth0
```


192.168.21.10 が割り当たっていればOKです。

# Windows ファイアウォールとポートフォワードの設定
bridged モードの場合

WSLが直接LANに参加しているので、ポートフォワードは不要です。
ただし、WSL内のポートをWindowsのファイアウォールがブロックすることがあります。

以下でポート8000を許可：
```
netsh advfirewall firewall add rule name="WSL Static Web" dir=in action=allow protocol=TCP localport=8000
```

# ゲートウェイ越えでアクセス確認

LAN内の別PCまたはスマホから以下にアクセスしてみます：

http://192.168.21.10:8000


→ 「Hello from WSL2 Static Server」が表示されれば成功 ✅

# 参考：NATモード + Port Forward での代替

もし bridged が難しい場合、従来のNATモードでポートフォワードを使う方法もあります。
PowerShellで以下のようにルールを追加：
```
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8000 connectaddress=127.0.0.1 connectport=8000
```

さらにファイアウォール許可：
```
netsh advfirewall firewall add rule name="WSL NAT Port 8000" dir=in action=allow protocol=TCP localport=8000
```

この場合は WindowsホストのIP にアクセスします（例：http://192.168.21.10:8000）。

# ポイントまとめ
方法	特徴	LAN越え
bridged モード（推奨）	直接LANに参加、固定IP割当可能	可能（GW越え可）
NAT + portproxy	デフォルト、簡単	可能（Windows経由）

ご希望によっては、Caddy や nginx をWSLに入れて自動起動させ、学内ネット全体に公開するようにも設定可能です。希望しますか？（例：systemd 有効化、caddy.service）