 locales['foreman_templates'] = locales['foreman_templates'] || {}; locales['foreman_templates']['ja'] = {
  "domain": "foreman_templates",
  "locale_data": {
    "foreman_templates": {
      "": {
        "Project-Id-Version": "foreman_templates 9.3.0",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-14 12:27+0000",
        "Last-Translator": "Amit Upadhye <aupadhye@redhat.com>, 2022",
        "Language-Team": "Japanese (https://www.transifex.com/foreman/teams/114/ja/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ja",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "ja",
        "domain": "foreman_templates",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "Branch in Git repo.": [
        "Git リポジトリーのブランチ。"
      ],
      "Override the default repo from settings.": [
        "設定からデフォルトのリポジトリーを上書きします。"
      ],
      "Export templates with names matching this regex (case-insensitive; snippets are not filtered).": [
        "この正規表現に一致する名前のテンプレートをエクスポートします (大文字と小文字は区別されず、スニペットはフィルタリングされません)。"
      ],
      "Negate the prefix (for purging).": [
        "プレフィックスを無効にします (パージ用)。"
      ],
      "The directory within Git repo containing the templates": [
        "テンプレートを含む Git リポジトリー内のディレクトリー"
      ],
      "Initiate Import": [
        "インポートを開始します"
      ],
      "The string all imported templates should begin with.": [
        "インポートされたすべてのテンプレートが開始する文字列"
      ],
      "Associate to OS's, Locations & Organizations. Options are: always, new or never.": [
        "OS、ロケーション、組織に関連付けます。オプションは always、new、または never。"
      ],
      "Update templates that are locked": [
        "ロックされているテンプレートを更新します"
      ],
      "Lock imported templates": [
        "インポートしたテンプレートをロックします"
      ],
      "Show template diff in response": [
        "応答としてテンプレートの差分を表示します"
      ],
      "Initiate Export": [
        "エクスポートを開始します"
      ],
      "Specify how to handle metadata": [
        "メタデータの処理方法を指定します"
      ],
      "Custom commit message for templates export": [
        "テンプレートエクスポート用のカスタムコミットメッセージ"
      ],
      "Using file-based synchronization, but couldn't access %s. ": [
        "ファイルベースの同期を使用していますが、%s にアクセスできませんでした。 "
      ],
      "Please check the access permissions/SELinux and make sure it is readable/writable for the web application user account, typically '%s'.": [
        "アクセス許可/SELinux を確認し、Web アプリケーションのユーザーアカウント (通常は '%s') に対して読み取り/書き込み可能であることを確認してください。"
      ],
      "Always": [
        "常に"
      ],
      "New": [
        "新規"
      ],
      "Never": [
        "なし"
      ],
      "Lock": [
        "ロック"
      ],
      "Keep, lock new": [
        "保持、新規項目のロック"
      ],
      "Keep, do not lock new": [
        "保持、新規項目のロックなし"
      ],
      "Unlock": [
        "ロック解除"
      ],
      "Refresh": [
        "更新"
      ],
      "Keep": [
        "保持"
      ],
      "Remove": [
        "削除"
      ],
      "Template Sync": [
        "テンプレート同期"
      ],
      "Choose verbosity for Rake task importing templates": [
        "テンプレートをインポートする Rake タスクの詳細を選択します"
      ],
      "Verbosity": [
        "詳細"
      ],
      "Associate templates to OS, organization and location": [
        "テンプレートをOS、組織、ロケーションに関連付けます"
      ],
      "Associate": [
        "関連付け"
      ],
      "The string that will be added as prefix to imported templates": [
        "インポートされたテンプレートの接頭辞として追加される文字列"
      ],
      "Prefix": [
        "接頭辞"
      ],
      "The directory within the Git repo containing the templates": [
        "テンプレートを含む Git リポジトリー内のディレクトリー"
      ],
      "Dirname": [
        "Dirname"
      ],
      "Import/export names matching this regex (case-insensitive; snippets are not filtered)": [
        "この正規表現に一致する名前をインポートまたはエクスポートします (大文字と小文字は区別されず、スニペットはフィルタリングされません)"
      ],
      "Filter": [
        "フィルター"
      ],
      "Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.": [
        "インポート/エクスポートのターゲットパス。/tmp/dir、git://example.com、https://example.com、ssh://example.com などの異なるプロトコルを使用できます。/tmp にエクスポートする場合には、実稼働デプロイメントがプライベート tmp を使用するように設定されている可能性があることに注意してください。"
      ],
      "Repo": [
        "リポジトリー"
      ],
      "Negate the filter for import/export": [
        "インポート/エクスポートのフィルターを無効にします。"
      ],
      "Negate": [
        "無効化"
      ],
      "Default branch in Git repo": [
        "Git リポジトリーのデフォルトブランチ"
      ],
      "Branch": [
        "ブランチ"
      ],
      "Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata": [
        "デフォルトのメタデータエクスポートモード、更新はメタデータを再レンダリングし、保持は既存のメタデータを保持し、削除はメタデータなしでテンプレートをエクスポートします"
      ],
      "Metadata export mode": [
        "メタデータエクスポートモード"
      ],
      "Should importing overwrite locked templates?": [
        "インポートするとロックされたテンプレートは上書きされますか?"
      ],
      "Force import": [
        "強制インポート"
      ],
      "How to handle lock for imported templates?": [
        "インポートされたテンプレートのロックを処理する方法"
      ],
      "Lock templates": [
        "テンプレートのロック"
      ],
      "Commit message": [
        "メッセージのコミット"
      ],
      "Sync Templates": [
        "テンプレートの同期"
      ],
      "Import or Export Templates": [
        "テンプレートのインポートまたはエクスポート"
      ],
      "Use default value from settings": [
        "設定のデフォルト値の使用"
      ],
      "Import": [
        ""
      ],
      "Export": [
        ""
      ],
      "Action type": [
        ""
      ],
      "Page Not Found": [
        "ページが見つかりませんでした"
      ],
      "The page you are looking for does not exist": [
        "探しているページは存在しません"
      ],
      "You are not authorized to perform this action.": [
        "このアクションを実行する権限がありません。"
      ],
      "Please request one of the required permissions listed below from a Foreman administrator:": [
        "以下に一覧表示された必須パーミッションのいずれかを、Foreman 管理者に要求してください:"
      ],
      "Permission Denied": [
        "パーミッションが拒否されました"
      ],
      "Back to sync form": [
        "同期フォームに戻る"
      ],
      "Remote action:": [
        "リモートアクション:"
      ],
      "Import facts": [
        "ファクトのインポート"
      ],
      "Action with sub plans": [
        "サブプランによるアクション"
      ],
      "Import Puppet classes": [
        "Puppet クラスのインポート"
      ]
    }
  }
};