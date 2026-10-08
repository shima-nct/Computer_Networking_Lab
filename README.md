# 2026年度 E3 ネットワーク構築

本実験は2回の実験を通して、学生がネットワーク構築・静的ルーティング・DNS・NAPT・DHCPを実践的に学び、その成果をレポートとしてまとめる能力を養うことを目的とする。

## 授業の連絡

実施日程、班分け、担当機器、提出期限などの連絡はTeamsで行う。リポジトリには教材とネットワークの技術情報を記載する。

## 実験室の共通GW

2026年10月8日、Proxmox `172.20.60.14` のVM100を指導書に合わせて設定・保存済み。共通LANは `192.168.1.0/24`、模擬外部は `10.0.0.0/24`。SSHは `vyos@172.20.60.13`。NAPTは第1回用に無効としている。

教材ファイルサーバー（VM101）も `192.168.1.10` へ移行済み。共有の接続先は `\\192.168.1.10\maintenance` および `\\192.168.1.10\images`。実験用DNS/Webサーバーは別途準備が必要。

NIC対応、検証結果、第2回への切り替えは[GW設定記録](configs/vyos/README-gw-2026.md)を参照。

## 教材の内容物一覧

準備作業：[RufusでVyOSの起動用USBメモリを作成する](chapters/vyos_usb_boot.qmd)（[閲覧・印刷用HTML](docs/chapters/vyos_usb_boot.html)）。USBへの書き込み、ライブ起動、ログイン、起動確認を扱う。

リモート操作：[VS Codeの準備とVyOSへのSSHログイン](chapters/vscode_vyos_ssh.qmd)（[閲覧・印刷用HTML](docs/chapters/vscode_vyos_ssh.html)）。VS Codeのインストール、SSHログイン、公開鍵認証とssh-agent、パスワード認証を無効にする場合の確認・復旧手順を扱う。

Webページ形式のドキュメントは[こちら](https://shima-nct.github.io/Computer_Networking_Lab/)から閲覧できる。

[概要説明スライド](https://shima-nct.github.io/Computer_Networking_Lab/slides/)は、全画面表示と左右キーでのページ送りに対応する。

今回の改訂は原稿と[HTML版](./docs/index.html)に反映。既存のPDF・スライドは今回の改訂前の版である。

原稿は[chapters](./chapters)、出力は[docs](./docs)に置く。`quarto render index.qmd --to html --no-clean`でHTMLを更新できる。

2026年10月8日の出力時は、`slides/.cache`内のアクセス拒否により作業フォルダーからのビルドが失敗したため、`index.qmd`・`_quarto.yml`・`styles.css`・参照する5章・`slides/network-overview.png`だけを一時フォルダーへコピーし、同コマンドに`--embed-resources`を付けて出力した。生成したHTMLを`docs/index.html`へ反映済み。

1.  **`experiment_design.qmd`**
    *   全体目標、配線、ペアと機器・IPの対応表、教員の事前準備を示す。

2.  **`experiment_manual_1.qmd`**
    *   第1回の配線・固定IP・VyOSの静的ルーティング・内部DNSと、Windows端末からの確認手順を示す。

3.  **`experiment_manual_2.qmd`**
    *   第2回のGWでのNAPT・外部Web接続・DNS・DHCPと、発展のWeb公開手順を示す。

4.  **`report_assignment.qmd`**
    *   学生に提示するレポート課題の詳細である。レポートの構成、考察で回答すべき具体的な問い、評価基準（ルーブリック）を記載している。

5.  **`linux_command_cheatsheet.qmd`**
    *   WindowsとVyOSの確認コマンドを実行場所別にまとめた補助資料である。

6.  **`network_diagram_1.mmd` / `network_diagram_2.mmd`**
    *   旧構成の参考図。現行の指導書では参照していない。`under_construction`内も旧構成・版の準備原稿であり、現行手順と混ぜない。
