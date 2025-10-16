# 全体構成

VyOS の DNS 関連設定は主に以下の3パターンがあります：

目的	設定箇所
1. VyOS 自身が名前解決できるようにする（DNS クライアント）	system name-server
2. LAN 内のクライアントに DNS を提供する（フォワーダ）	service dns forwarding
3. DHCP 配布時にクライアントへ DNS サーバ情報を伝える	service dhcp-server shared-network-name ...
🧰 1. VyOS 自身の DNS 設定（system name-server）

VyOS 自身が ping google.com やパッケージ更新などで名前解決を行えるように、上流（プロバイダや他のDNSサーバ）を指定します。

configure

## 例：Google Public DNSとCloudflareを指定
```
set system name-server 8.8.8.8
set system name-server 1.1.1.1

commit
save
exit
```

確認コマンド：
```
show system name-server
```

# 2. DNS フォワーダ（LAN向けにDNSサービスを提供）

VyOS は dns forwarding 機能を持っており、LAN からの問い合わせを受けて上流に転送し、キャッシュして返すことができます。
これは 小規模ネットワークのローカルDNSサーバ として非常に便利です。

例：LAN 側（192.168.10.0/24）で VyOS を DNS サーバにする
configure

# DNS フォワーディングを有効化
```
set service dns forwarding
```

# 上流 DNS（フォワード先）を指定（任意。省略すれば system name-server を使う）
```
set service dns forwarding name-server 192.168.1.1
set service dns forwarding name-server 192.168.1.21
set service dns forwarding name-server 192.168.1.22
set service dns forwarding name-server 192.168.1.23
set service dns forwarding name-server 192.168.1.24
set service dns forwarding name-server 192.168.1.25
```

# LAN 側からの問い合わせを許可
```
set service dns forwarding listen-address 192.168.10.1

commit
save
exit
```

確認

VyOS 上で：
```
show service dns forwarding
```

LAN 側クライアントで：

nslookup google.com 192.168.10.1

📡 3. DHCP 経由で DNS 情報を配布

LAN のクライアントに IP アドレスと同時に DNS サーバ情報を DHCP で配布することもできます。
VyOS 自身を DNS として使う場合が多いです。

例：LAN DHCP で VyOS を DNS として配布
```
configure

# DHCP サーバ設定例
```
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.10.0/24 default-router 192.168.10.1
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.10.0/24 subnet-id 10
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.10.0/24 range 0 start 192.168.10.100
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.10.0/24 range 0 stop  192.168.10.150
```

# DNS サーバとして VyOS 自身を通知
```
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.10.0/24 dns-server 192.168.10.1

commit
save
exit
```

# 4. 動作確認のための便利コマンド
目的	コマンド
VyOS 自身のDNS解決確認	ping google.com / nslookup
DNS フォワーダの状態確認	show service dns forwarding statistics
DHCP クライアントに配布されているDNS確認（Linux）	cat /etc/resolv.conf または resolvectl status
キャッシュクリア	restart dns forwarding（VyOS 1.4以降は restart コマンドで再起動）
よくあるハマりポイント

127.0.0.1 に対する問い合わせがタイムアウトする
→ listen-address 127.0.0.1 を追加すればローカルからの問い合わせも受けられます：
```
set service dns forwarding listen-address 127.0.0.1
```

systemd-resolved がない
VyOS は Debian ベースですが、systemd-resolved の stub resolver は基本無効なので、Ubuntu のような 127.0.0.53 は使いません。

DNSフォワーダを立ち上げただけではクライアントが使ってくれない
→ DHCPで明示的に dns-server を配布するか、手動でクライアントのDNSを設定してください。

#  まとめ
設定対象	コマンド	用途
VyOS 自身	set system name-server	VyOS 自身の名前解決
LAN クライアント向けDNS	set service dns forwarding	ローカルDNSサーバ機能
DHCP経由でクライアントに配布	set service dhcp-server ... dns-server	自動設定
🏁 おまけ：簡単な一括設定例（LAN内DNSサーバとして動作）
```
configure

# VyOS 自身が上流のDNSを使えるように設定
set system name-server 8.8.8.8
set system name-server 1.1.1.1

# DNSフォワーダ起動（LAN + ローカル向け）
set service dns forwarding name-server 8.8.8.8
set service dns forwarding name-server 1.1.1.1
set service dns forwarding listen-address 192.168.10.1
set service dns forwarding listen-address 127.0.0.1

# DHCPで配布
set service dhcp-server shared-network-name LAN subnet 192.168.10.0/24 dns-server 192.168.10.1

commit
save
exit
```