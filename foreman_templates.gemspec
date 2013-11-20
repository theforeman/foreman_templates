$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "foreman_templates/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name             = %q{foreman_templates}
  s.version          = ForemanTemplates::VERSION
  s.authors          = ["Greg Sutcliffe"]
  s.email            = %q{gsutclif@redhat.com}
  s.description      = %q{Engine to sychronise provisioning templates from GitHub}
  s.extra_rdoc_files = [
    "LICENSE",
    "README.md"
  ]
  s.files            = Dir["{app,config,db,lib}/**/*"] + ["LICENSE", "Rakefile", "README.md"]
  s.homepage         = %q{http://github.com/theforeman/foreman_templates}
  s.licenses         = ["GPL-3"]
  s.summary          = %q{Template-syncing engine for Foreman}

  s.add_dependency "diffy"

end
