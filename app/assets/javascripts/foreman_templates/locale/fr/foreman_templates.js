 locales['foreman_templates'] = locales['foreman_templates'] || {}; locales['foreman_templates']['fr'] = {
  "domain": "foreman_templates",
  "locale_data": {
    "foreman_templates": {
      "": {
        "Project-Id-Version": "foreman_templates 9.3.0",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2019-10-14 12:27+0000",
        "Last-Translator": "Amit Upadhye <aupadhye@redhat.com>, 2022",
        "Language-Team": "French (https://www.transifex.com/foreman/teams/114/fr/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "fr",
        "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;",
        "lang": "fr",
        "domain": "foreman_templates",
        "plural_forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;"
      },
      "Branch in Git repo.": [
        "Branche dans le référentiel Git."
      ],
      "Override the default repo from settings.": [
        "Remplace le référentiel par défaut des paramètres."
      ],
      "Export templates with names matching this regex (case-insensitive; snippets are not filtered).": [
        "Exporte les modèles dont les noms correspondent à cette expression rationnelle (insensible à la casse ; les extraits ne sont pas filtrés)."
      ],
      "Negate the prefix (for purging).": [
        "Négation du préfixe (pour purger)."
      ],
      "The directory within Git repo containing the templates": [
        "Le répertoire du référentiel Git contenant les modèles"
      ],
      "Initiate Import": [
        "Initier l'importation"
      ],
      "The string all imported templates should begin with.": [
        "La chaîne de caractères par laquelle tous les modèles importés doivent commencer."
      ],
      "Associate to OS's, Locations & Organizations. Options are: always, new or never.": [
        "Associer à des systèmes d'exploitation, des emplacements et des organisations. Les options sont : toujours, nouveau ou jamais."
      ],
      "Update templates that are locked": [
        "Mettre à jour les modèles qui sont verrouillés"
      ],
      "Lock imported templates": [
        "Verrouiller les modèles importés"
      ],
      "Show template diff in response": [
        "Afficher la différence de modèle dans la réponse"
      ],
      "Initiate Export": [
        "Initier l'exportation"
      ],
      "Specify how to handle metadata": [
        "Spécifier comment traiter les métadonnées"
      ],
      "Custom commit message for templates export": [
        ""
      ],
      "Using file-based synchronization, but couldn't access %s. ": [
        "J'utilise la synchronisation basée sur les fichiers, mais je n'ai pas pu accéder à %s. "
      ],
      "Please check the access permissions/SELinux and make sure it is readable/writable for the web application user account, typically '%s'.": [
        ""
      ],
      "Always": [
        "Toujours"
      ],
      "New": [
        "Nouveau"
      ],
      "Never": [
        "Jamais"
      ],
      "Lock": [
        "Verrou"
      ],
      "Keep, lock new": [
        ""
      ],
      "Keep, do not lock new": [
        ""
      ],
      "Unlock": [
        "Déverrouillage"
      ],
      "Refresh": [
        "Réactualiser"
      ],
      "Keep": [
        "Gardez"
      ],
      "Remove": [
        "Supprimer"
      ],
      "Template Sync": [
        ""
      ],
      "Choose verbosity for Rake task importing templates": [
        "Choisir la verbosité pour les modèles d'importation de tâches Rake"
      ],
      "Verbosity": [
        "Verbosité"
      ],
      "Associate templates to OS, organization and location": [
        "Associer des modèles au système d'exploitation, à l'organisation et au lieu"
      ],
      "Associate": [
        "Associer"
      ],
      "The string that will be added as prefix to imported templates": [
        ""
      ],
      "Prefix": [
        "Préfixe"
      ],
      "The directory within the Git repo containing the templates": [
        "Le répertoire du référentiel Git contenant les modèles"
      ],
      "Dirname": [
        "Dirname"
      ],
      "Import/export names matching this regex (case-insensitive; snippets are not filtered)": [
        ""
      ],
      "Filter": [
        "Filtre"
      ],
      "Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.": [
        ""
      ],
      "Repo": [
        "Référentiel"
      ],
      "Negate the filter for import/export": [
        ""
      ],
      "Negate": [
        "Annule"
      ],
      "Default branch in Git repo": [
        "Branche par défaut dans le repo Git"
      ],
      "Branch": [
        "Branche"
      ],
      "Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata": [
        "Mode d'exportation des métadonnées par défaut, rafraîchir restitue les métadonnées, conserver les métadonnées existantes, supprimer exporte le modèle sans métadonnées"
      ],
      "Metadata export mode": [
        "Mode d'exportation des métadonnées"
      ],
      "Should importing overwrite locked templates?": [
        "L'importation doit-elle écraser les modèles verrouillés ?"
      ],
      "Force import": [
        "Forcer l'importation"
      ],
      "How to handle lock for imported templates?": [
        ""
      ],
      "Lock templates": [
        "Verrouillage des modèles"
      ],
      "Commit message": [
        ""
      ],
      "Sync Templates": [
        "Modèles de synchronisation"
      ],
      "Import or Export Templates": [
        ""
      ],
      "Use default value from settings": [
        ""
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
        ""
      ],
      "The page you are looking for does not exist": [
        ""
      ],
      "You are not authorized to perform this action.": [
        "Vous n'êtes pas autorisé à effectuer cette action."
      ],
      "Please request one of the required permissions listed below from a Foreman administrator:": [
        "Merci de demander une des permissions requises listées ci-dessous à un administrateur de Foreman :"
      ],
      "Permission Denied": [
        "Permission non accordée"
      ],
      "Back to sync form": [
        ""
      ],
      "Remote action:": [
        "Action distante :"
      ],
      "Import facts": [
        "Importer des faits"
      ],
      "Action with sub plans": [
        "Action avec sous-plans"
      ],
      "Import Puppet classes": [
        "Importer des classes Puppet"
      ]
    }
  }
};