 locales['foreman_templates'] = locales['foreman_templates'] || {}; locales['foreman_templates']['es'] = {
  "domain": "foreman_templates",
  "locale_data": {
    "foreman_templates": {
      "": {
        "Project-Id-Version": "foreman_templates 10.0.3",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-14 12:27+0000",
        "Last-Translator": "Bryan Kearney <bryan.kearney@gmail.com>, 2024",
        "Language-Team": "Spanish (https://app.transifex.com/foreman/teams/114/es/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "es",
        "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;",
        "lang": "es",
        "domain": "foreman_templates",
        "plural_forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;"
      },
      "Action type": [
        ""
      ],
      "Always": [
        "总是"
      ],
      "Associate": [
        "Associate"
      ],
      "Associate templates to OS, organization and location": [
        "将模板与操作系统，机构和位置相关联"
      ],
      "Associate to OS's, Locations & Organizations. Options are: always, new or never.": [
        "与操作系统，位置和机构相关。选项为：总是，新的或永不。"
      ],
      "Back to sync form": [
        "返回到同步表单"
      ],
      "Branch": [
        "分支"
      ],
      "Branch in Git repo.": [
        "Git 仓库中的分支。"
      ],
      "Choose verbosity for Rake task importing templates": [
        "为 Rake 任务导入模板选择详细程度"
      ],
      "Commit message": [
        "提交消息"
      ],
      "Custom HTTP proxy": [
        ""
      ],
      "Custom commit message for templates export": [
        "模板导出的自定义提交消息"
      ],
      "Default branch in Git repo": [
        "Git 仓库中的默认分支"
      ],
      "Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata": [
        "默认元数据导出模式，刷新后重新渲染元数据，保留将保留现有元数据，删除不包含元数据的导出模板"
      ],
      "Directory within Git repo containing the templates.": [
        ""
      ],
      "Dirname": [
        "Dirname"
      ],
      "Export": [
        "Exportar"
      ],
      "Export templates with names matching this regex (case-insensitive; snippets are not filtered).": [
        "导出名称与此正则表达式匹配的模板（不区分大小写；不过滤代码段）。"
      ],
      "Filter": [
        "Filtro"
      ],
      "Force import": [
        "强制导入"
      ],
      "Global default HTTP proxy": [
        ""
      ],
      "HTTP proxy": [
        "Proxy HTTP"
      ],
      "HTTP proxy policy": [
        ""
      ],
      "HTTP proxy policy for template sync. \\\\\\n          Use only when synchronizing templates through the HTTP or the HTTPS protocol. If you choose 'selected', provide the `http_proxy_id` parameter.": [
        ""
      ],
      "How to handle lock for imported templates?": [
        "如何处理导入的模板锁定？"
      ],
      "ID of an HTTP proxy to use for template sync. Use this parameter together with `'http_proxy_policy':'selected'`": [
        ""
      ],
      "Import": [
        "Importar"
      ],
      "Import or Export Templates": [
        "导入或导出模板"
      ],
      "Import/export names matching this regex (case-insensitive; snippets are not filtered)": [
        "导入/导出与该正则表达式匹配的名称（不区分大小写；不过滤代码段）"
      ],
      "Initiate Export": [
        "启动导出"
      ],
      "Initiate Import": [
        "启动导入"
      ],
      "Invalid repo format, must start with one of: ": [
        ""
      ],
      "Keep": [
        "保持"
      ],
      "Keep, do not lock new": [
        "keep，不锁定新的"
      ],
      "Keep, lock new": [
        "keep, 锁定新的"
      ],
      "Lock": [
        "Bloqueo"
      ],
      "Lock imported templates": [
        "锁定导入的模板"
      ],
      "Lock templates": [
        "锁定模板"
      ],
      "Metadata export mode": [
        "元数据导出模式"
      ],
      "Negate": [
        "否定"
      ],
      "Negate the filter for import/export": [
        "导入/导出的负过滤器"
      ],
      "Negate the prefix (for purging).": [
        "否定前缀（用于清除）。"
      ],
      "Never": [
        "Nunca"
      ],
      "New": [
        "Nuevo"
      ],
      "No HTTP proxy": [
        ""
      ],
      "Override the default repo from settings.": [
        "覆盖设置中的默认仓库。"
      ],
      "Page Not Found": [
        "页没有找到"
      ],
      "Permission Denied": [
        "Permiso negado"
      ],
      "Please check the access permissions/SELinux and make sure it is readable/writable for the web application user account, typically '%s'.": [
        "请检查访问权限/ SELinux，确保 Web 应用程序用户帐户（通常为 '%s'）可读写。"
      ],
      "Please request one of the required permissions listed below from a Foreman administrator:": [
        "Solicite uno de los permisos requeridos que aparecen a continuación a un administrador de Foreman:"
      ],
      "Prefix": [
        "前缀"
      ],
      "Refresh": [
        "Actualizar"
      ],
      "Remove": [
        "Eliminar"
      ],
      "Repo": [
        "仓库"
      ],
      "Select an HTTP proxy to use for template sync. You can add HTTP proxies on the Infrastructure > HTTP proxies page.": [
        ""
      ],
      "Should an HTTP proxy be used for template sync? If you select Custom HTTP proxy, you will be prompted to select one.": [
        ""
      ],
      "Should importing overwrite locked templates?": [
        "是否应该导入覆盖锁定的模板？"
      ],
      "Show template diff in response": [
        "显示模板差异作为响应"
      ],
      "Specify how to handle metadata": [
        "指定如何处理元数据"
      ],
      "Sync Templates": [
        "同步模板"
      ],
      "Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.": [
        "要导入/导出的目标路径。可以使用不同的协议，如 /tmp/dir、git://example.com、https://example.com、ssh://example.com. 当导出至 /tmp 时，请注意，生产部署可能被配置为使用私有 tmp。"
      ],
      "Template Sync": [
        "模板同步"
      ],
      "The directory within the Git repo containing the templates": [
        "Git 仓库中包含模板的目录"
      ],
      "The page you are looking for does not exist": [
        "您查找的页面不存在"
      ],
      "The string all imported templates should begin with.": [
        "所有导入的模板应以字符串开头。"
      ],
      "The string that will be added as prefix to imported templates": [
        "将作为前缀添加到导入模板的字符串"
      ],
      "Unlock": [
        "Desbloquear"
      ],
      "Update templates that are locked": [
        "更新锁定的模板"
      ],
      "Use default value from settings": [
        "使用设置中的默认值"
      ],
      "Using file-based synchronization, but couldn't access %s. ": [
        "使用基于文件的同步，但无法访问 %s。 "
      ],
      "Verbosity": [
        "详细度"
      ],
      "You are not authorized to perform this action.": [
        "No está autorizado para realizar esta acción."
      ]
    }
  }
};