# 前提条件

VyOS の該当インタフェース（例：eth1）に 固定IPアドレス が割り当てられていること

DHCPサーバーを提供するサブネットが決まっていること
例：

LAN: 192.168.0.0/24

VyOSのLAN側アドレス: 192.168.0.1

# 2. 基本設定例

以下の例では、eth1 に接続された LAN で DHCP サーバーを動かし、クライアントに 192.168.0.100〜192.168.0.200 のアドレスを配布します。

configure

# DHCPサーバーを動かすネットワークの設定
```
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 default-router 192.168.0.1
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 dns-server 192.168.0.1
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 domain-name local.lan
```

# IPアドレスプール
```
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 range 0 start 192.168.0.100
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 range 0 stop 192.168.0.200
```

# 任意：サブネットID（VyOS 1.4+ では必須）
```
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 subnet-id 10

commit
save
exit
```

# 3. 動作確認
DHCPリースの確認
```
show dhcp server leases
```

DHCPサービスの状態確認
```
show service dhcp-server
```

# 4. 固定IP（Static Mapping）の追加

特定のMACアドレスに固定IPを割り当てることも可能です。

```
configure
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 static-mapping PC1 ip-address 192.168.0.50
set service dhcp-server shared-network-name LAN-ETH1 subnet 192.168.0.0/24 static-mapping PC1 mac-address 00:11:22:33:44:55
commit
save
exit
```

# 5. よくあるエラーと対策
エラーメッセージ	原因	対応策
Unique subnet ID not specified	subnet-id が設定されていない	set ... subnet-id X を追加
No DHCP address range or active static-mapping configured	IPレンジが未設定	range または static-mapping を追加
クライアントがIPを受け取らない	VyOSインタフェースが正しく設定されていない、またはDHCPが有効になっていない	show interfaces で確認、DHCPサーバー設定の再チェック
# 6. インタフェース側の設定例（参考）

DHCPを提供するインタフェース側の設定例（eth1）：

```
configure
set interfaces ethernet eth1 address 192.168.0.1/24
commit
save
exit
```

# 補足：VyOSのバージョンによる違い

VyOS 1.3 (rolling以前) → subnet-id が不要な場合もある

VyOS 1.4 以降 → DHCPサーバーで subnet-id が 必須

# 補足：VyOSのバージョンによる違い

VyOS 1.3 (rolling以前) → subnet-id が不要な場合もある

VyOS 1.4 以降 → DHCPサーバーで subnet-id が 必須