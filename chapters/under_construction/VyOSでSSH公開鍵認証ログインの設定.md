# 概要

VyOS 上で SSH 公開鍵認証ログインを有効化する手順をまとめる。パスワード認証を無効にして鍵だけでログインできるようにしておくと、踏み台やリモート管理時のセキュリティが高まる。

# 1. 前提条件

- VyOS 1.3 以降（1.4 でも同一手順で動作確認）
- SSH でアクセスする管理アカウント（例: `vyos`）が作成済み
- クライアント PC から VyOS の管理 IP（例: `192.168.0.1`）へ到達できること
- クライアントに OpenSSH がインストール済み（Windows 10 以降 / macOS / Linux）

# 2. クライアント側で SSH 鍵を作成

既存の鍵がない場合は新規に作成し、公開鍵 (`.pub`) を控える。Ed25519 を推奨し、古い環境で互換性が必要なら RSA を使う。

## Windows (PowerShell)

```
ssh-keygen -t ed25519 -C "vyos-admin"
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

## macOS / Linux

```
ssh-keygen -t ed25519 -C "vyos-admin"
cat ~/.ssh/id_ed25519.pub
```

表示された 1 行をそのまま VyOS の設定で使う。後で書き換えやすいようにメモ帳などへコピーしておく。

# 3. VyOS へ公開鍵を登録

1. VyOS へ既存方法（コンソールや一時的なパスワード認証）でログインし `configure` モードへ。
2. 以下の例を参考に、ユーザーと鍵の名前を決めて設定する。

```
configure
set system login user vyos authentication public-keys pc01 type ssh-ed25519
set system login user vyos authentication public-keys pc01 key "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyStringOnlyReplaceMe"
# (任意) パスワード認証を禁止して鍵のみ許可
set service ssh disable-password-authentication
# (任意) 管理セグメントだけで待ち受ける
set service ssh listen-address 192.168.0.1
commit
save
exit
```

- `public-keys pc01` の `pc01` は任意名。複数端末を区別したい場合は PC ごとに名前を変える。
- `key` の値には先ほど控えた公開鍵 1 行全体をダブルクォーテーションで囲って貼り付ける。`"` を含む場合はシングルクォートへ変更。
- 新しいユーザーを作る場合は `set system login user <user> authentication plaintext-password <pass>` で初期パスワードだけ設定し、公開鍵登録後に `delete system login user <user> authentication plaintext-password` も可能。

# 4. 動作確認

クライアント側で秘密鍵のパーミッションを確認したうえで SSH する。

```
ssh vyos@192.168.0.1
```

初回接続でフィンガープリント確認が出たら `yes`。パスフレーズを設定していれば入力を求められる。`show login` で VyOS 側から接続を確認できる。

パスワード認証を無効化した場合は、公開鍵が登録されていない端末から `Permission denied (publickey)` と表示されることを確認しておく。

# 5. よくあるトラブル

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `Permission denied (publickey)` | 鍵タイプやキー文字列が誤って保存されている | `show configuration commands | match public-keys` で登録内容を確認し、再度貼り付け |
| まだパスワードで入れてしまう | `set service ssh disable-password-authentication` が未設定 | 追加設定後 `commit && save` |
| VyOS へ接続できない | 管理セグメント外からアクセス | `set service ssh listen-address` を削除するか正しい IP へ変更 |
| うっかり鍵を削除した | 物理コンソールでログインし再登録 | `delete system login user vyos authentication public-keys pc01` で整理して再設定 |

# 6. バックアップと運用メモ

- 公開鍵登録後は `show configuration commands | match public-keys` の出力を控えておくと復旧しやすい。
- 端末を入れ替えた場合は既存の `public-keys <name>` を削除してから新しい鍵を登録する。
- 定期的に `set service ssh ciphers` や `kex-algorithms` などで暗号スイートを見直すとさらに堅牢になる。
