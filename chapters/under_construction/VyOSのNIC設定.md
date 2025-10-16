# 1. VyOS の 2 つのモード

VyOS には、以下の2つの操作モードがあります：

## モード名	目的・特徴
Operational モード（運用モード）	通常の Linux シェルに近い。状態確認・一時的な操作・診断コマンドの実行などに使う。プロンプトは vyos@vyos:~$ のようになる。
Configuration モード（設定モード）	ルータの本格的な設定変更を行うモード。設定はトランザクション的に扱われ、commit で反映、save で永続化する。プロンプトは vyos@vyos# になる。

## 設定モードに入る

運用モードから次のコマンドで設定モードに入ります：

```
vyos@vyos:~$ configure
[edit]
vyos@vyos#
```


[edit] と表示され、プロンプト末尾が # になるのが目印です。

## 設定モードの特徴
設定は「候補（candidate）」に蓄積される

設定モードで set ... や delete ... を行っても、すぐには実際のシステムには反映されません。
一時的な「候補コンフィグ」に変更を貯めておく仕組みになっています。

例：

set interfaces ethernet eth1 address 192.168.1.21/24


この時点ではまだネットワーク設定は変わりません。

## commit で反映

候補設定をシステムに適用するには commit を実行します：

commit


これにより VyOS が内部的に設定を検証（syntax check・依存関係チェック）し、問題がなければ実際のシステムに反映します。

## save で永続化

commit で反映しても、再起動すると消える設定もあります。
確実に次回起動時も残したい場合は save で /config/config.boot に保存します：

save


これで再起動後も設定が復元されます。

## discard で取り消し

変更を加えたがやめたい場合は以下でキャンセルできます：

discard

## compare で差分表示

現在の running-config と、未 commit の差分を確認できます：

compare

# 2. 設定モードに入る
vyos@vyos:~$ configure

# 3. DHCPでアドレスを取得する設定

外向き（WAN）インタフェースなどでよく使います。

set interfaces ethernet eth0 address 192.168.1.21/24

# 4. 静的IPアドレスを設定する

LAN 側などで固定アドレスを設定する場合。

set interfaces ethernet eth1 address 192.168.21.1/24

# 5. MACアドレスを固定する

NICが差し替わる場合や、eth名が変わってしまう場合に有用。

set interfaces ethernet eth0 hw-id bc:24:11:6a:42:bf

# 6 . 変更を反映する

設定を終えたら以下で反映＆保存します：

commit
save
exit

# 8. デフォルトルートの設定

外部（インターネット）へ出るためのルートを追加。

set protocols static route 0.0.0.0/0 next-hop 192.168.1.1

# 9. 設定ファイルの場所

設定は以下に保存されています：

/config/config.boot


save コマンドでこのファイルに書き込まれます。
バックアップはこのファイルをGitHubやUSBにコピーしておくと便利です。

 例：LAN＋WAN 2インタフェース構成
configure

## WAN側（DHCP）
```
set interfaces ethernet eth0 address 192.168.1.21/24
set interfaces ethernet eth0 hw-id bc:24:11:6a:42:bf
```

## LAN側（静的）
```
set interfaces ethernet eth1 address 192.168.21.1/24
set interfaces ethernet eth1 hw-id bc:24:11:a9:3f:0d
```

## デフォルトルート（WANへ）
```
set protocols static route 0.0.0.0/0 next-hop 192.168.1.1
commit
save
exit
```

# 10. トラブル時の確認コマンド
目的	コマンド
インタフェースの状態確認	
```
show interfaces
```

DHCPリースの確認	
```
run show dhcp client leases
```
ルーティングテーブル	
```
show ip route
```
設定の差分確認	
```
compare
```
設定ファイルの確認	
```
cat /config/config.boot
```