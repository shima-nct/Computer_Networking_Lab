# キーボードについての注意

https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%BC%E9%85%8D%E5%88%97

# NICの確認

```
ip addr show eth0
ip addr show eth1
```

# IPアドレスの設定

```
ip addr add 192.168.0.301/24 dev eth0
ip addr add 192.168.1.1/24 dev eth1
```

# ルーティングテーブルの設定

```
route add default via 192.168.0.1
```

# 名前解決のための設定

```
vi /etc/resolv.conf
```

```
nameserver 192.168.0.1
```

# 疎通確認

```
ping 192.168.0.1
ping 1.1.1.1
```

# 名前解決の確認

```
nslookup google.com
```

# sshの設定

```
sudo apt update
sudo apt install openssh-server
```

# WindowsからVSCodeでリモート接続するための設定

```
copy-id vyos@192.168.0.301
```

# VSCodeを起動する。

# VSCodeからリモート接続

# VSCodeの設定

## save as root拡張のインストール
