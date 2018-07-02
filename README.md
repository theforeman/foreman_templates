# foreman\_templates

This plugin will sync the contents of the Foreman Community Templates
[repository](https://github.com/theforeman/community-templates/) (or a git repo
of your choice) to your local Foreman instance. It can also be used to sync
local directory, therefore any other version control systems can be used.

## Installation

See [Install a plugin](http://theforeman.org/manuals/latest/index.html#6.1InstallaPlugin) in the 
Foreman documentation for how to install Foreman plugins.

The gem name is "foreman_templates".

RPM users can install the "tfm-rubygem-foreman_templates" or "rubygem-foreman_templates" packages.

## Latest code

You can get the develop branch of the plugin by specifying your Gemfile in this way:

    gem 'foreman_templates', :git => "https://github.com/theforeman/foreman_templates.git"

## Configuration

The plugin comes with settings providing sane defaults for import. You can change them under Administer > Settings, TemplateSync tab.
These can be overriden for each import by passing options directly to a Rake task (see [Usage](https://github.com/theforeman/foreman_templates#usage) section for how to do that)

## Usage

For more detailed description, please see [the plugin manual](https://www.theforeman.org/plugins/foreman_templates/), select the approriate version

## Integration with other Foreman Plugins

This plugin now fully relies on core importing capabilities. That means models inheriting from Template class are supported. To customize import behavior,
you can override `import_custom_data` in your inheritting class. See example at [remote execution plugin](https://github.com/theforeman/foreman_remote_execution/blob/v1.5.3/app/models/job_template.rb#L201-L217)

## Copyright

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
