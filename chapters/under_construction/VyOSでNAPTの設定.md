# NAPT設定の概要

VyOSでのNAT（Network Address Translation）設定は、主に以下の3種類に分けられます

Source NAT（SNAT） — 内側（LAN）→外側（WAN）への通信（インターネット接続など）

Destination NAT（DNAT） — 外側（WAN）→内側（LAN）への通信（ポートフォワーディング）

Masquerade（動的NAT） — 典型的な家庭・学内LAN→インターネット接続の形

以下にそれぞれの設定例を示します。

# 前提ネットワーク構成
インタフェース	IPアドレス	用途
eth0	192.168.1.21/24	WAN側（上位ルータへ）
eth1	192.168.21.1/24	LAN側

LAN側からWAN側へのインターネットアクセスをNATで中継し、必要に応じて外部→内部へのポートフォワーディングを行います。

# Source NAT（Masquerade）設定

LAN→WANの通信にグローバルIP（またはWANインターフェースのIP）を使わせる設定です。

configure

# LAN 192.168.21.0/24 から出ていく通信を eth0 のIPに変換する
set nat source rule 100 outbound-interface 'eth0'
set nat source rule 100 source address '192.168.21.0/24'
set nat source rule 100 translation address 'masquerade'

commit
save
exit


# masquerade を指定すると、WAN側のアドレスが変動しても自動的にそれを使ってNATします。
固定IPを持っている場合は、translation address '192.168.21.15' のように固定指定も可能です。

# Destination NAT（ポートフォワーディング）設定

外部からLAN上の特定ホストへ通信を転送する場合（例：HTTPサーバーを192.168.21.10で運用、WANのTCP/80に来た通信を転送）

configure

# WAN側 eth1 の TCP/80 を 内部の 192.168.21.10:80 に転送
set nat destination rule 200 inbound-interface 'eth0'
set nat destination rule 200 destination port '80'
set nat destination rule 200 protocol 'tcp'
set nat destination rule 200 translation address '192.168.21.10'
set nat destination rule 200 translation port '80'

commit
save
exit


# この設定に加えて、VyOS自身のファイアウォールでWAN→LANを許可するルールが必要になる場合があります（デフォルトでは外からのアクセスはブロック）。

# NATの確認

設定が正しく適用されているかは、以下で確認します：

show nat source rules
show nat destination rules

# セッションテーブルを確認
show nat source translations
show nat destination translations

# ファイアウォールと組み合わせる場合の注意点

VyOSでは、NATとファイアウォールは独立しているため、

NATで宛先を変換してもファイアウォールで許可しなければ通信は通りません。

特にDNATを設定した場合は、WAN → LAN のfirewall ruleで該当ポートを許可する必要があります。

例：DNATした80番ポートをWANから許可する

configure

set firewall name WAN_LOCAL default-action drop
set firewall name WAN_LOCAL rule 10 action accept
set firewall name WAN_LOCAL rule 10 protocol tcp
set firewall name WAN_LOCAL rule 10 destination port 80

set interfaces ethernet eth1 firewall in name WAN_LOCAL

commit
save
exit

# よくあるトラブル
症状	原因	対処
内側から外へ通信できない	masquerade設定の漏れ or default routeがない	show configuration commandsでNATとルートを確認
外から転送できない	DNATはあるがFWで拒否	firewall in で許可ルールを追加
セッションが通らない	NATより前にFWで落とされている	NATとFirewallの適用順序を確認（NAT→FWの順）