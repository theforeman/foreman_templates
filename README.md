# foreman\_templates

This plugin will sync the contents of the Foreman Community Templates
[repository](https://github.com/theforeman/community-templates/) to your local
Foreman instance

# Installation

Require the gem in Foreman, `bundler.d/Gemfile.local.rb`:

```yaml
gem 'foreman_templates', :git => "https://github.com/GregSutcliffe/foreman_templates.git"
```

Update Foreman with the new gems:

    bundle update

# Configuration

There is UI no configuration at this time.

# Usage

The plugin provides a Rake task to import the templates. To use it, simply do

    bundle exec rake templates:sync

This will create a set of templates named "Community ...." (or update them if they
already exist). Audit history is preserved, but no comment is currently added for
any changes made.

No OS associations are made by default when the templates are created, but on
subsequent updates the existing associations will be preserved

# Rake options

* verbose => Print extra information during the run
* repo => Sync templates from a different Git repo

# TODO

* Allow user to filter to a specific subset of templates
* Make "Community" prefix configurable
* Add a button to the UI with Deface to run the rake task

# Copyright

Copyright (c) 2013 Greg Sutcliffe

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
