# foreman\_templates

This plugin will sync the contents of the Foreman Community Templates
[repository](https://github.com/theforeman/community-templates/) (or a git repo
of your choice) to your local Foreman instance

## Installation

See [Install a plugin](http://theforeman.org/manuals/latest/index.html#6.1InstallaPlugin) in the 
Foreman documentation for how to install Foreman plugins.

The gem name is "foreman_templates".

RPM users can install the "ruby193-rubygem-foreman_templates" or "rubygem-foreman_templates" packages.

## Latest code

You can get the develop branch of the plugin by specifying your Gemfile in this way:

    gem 'foreman_templates', :git => "https://github.com/theforeman/foreman_templates.git"

## Configuration

The plugin comes with settings providing sane defaults for import. You can change them under Administer > Settings, TemplateSync tab.
These can be overriden for each import by passing options directly to a Rake task (see [Usage](https://github.com/theforeman/foreman_templates#usage) section for how to do that)

## Usage

### Import

The plugin provides a Rake task to import the templates. To use it, simply do

    foreman-rake templates:sync

This will create a set of templates named "Community ...." (or update them if they
already exist). Audit history is preserved, but no comment is currently added for
any changes made.

The importer will attempt to figure out the OS and Release the template refers to. If
this is a new template being created, and we can find a matching OS in Foreman, the
template will be automatically associated with the OS

#### Rake options

* verbose   => Print extra information during the run [false]
* repo      => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
* branch    => Branch in Git repo [_see note below_]
* prefix    => The string all imported templates should begin with [Community]
* dirname   => The directory within the git tree containing the templates [/]
* filter    => Import names matching this regex (case-insensitive; snippets are not filtered)
* associate => Associate to OS, "always", when "new" or "never"  [new]

The `branch` default will use *develop* if you're on Foreman-nightly; or the
matching *1.X-stable* branch for your version of Foreman (if it exists); or
finally it will remain on the default branch as a fallback.

Passing any option to a Rake task overrides its default value from a corresponding Setting.

#### Examples

Just import all the templates from the default repo

    foreman-rake templates:sync

Import all templates from a custom repo, with a different prefix

    foreman-rake templates:sync repo="http://github.com/GregSutcliffe/community-templates" prefix="Greg"

Import templates matching the name "Fedora"

    foreman-rake templates:sync filter='fedora'

Import templates from a subdirectory of a git repo:

    foreman-rake templates:sync repo="http://github.com/GregSutcliffe/community-templates" dirname='/subdir'

### Purge

This task deletes matching templates from the Foreman DB

#### Rake options

* prefix    => The string all templates to be purged should begin with [Community ]
* negate    => Negate the search [false]
* verbose   => Print extra information during the run [false]

#### Examples

Just purge all the templates the begin with 'Community '

    foreman-rake templates:purge

Purge all templates that begin with 'Oops '

    foreman-rake templates:purge prefix='Oops '

Purge all templates that do not begin with 'Community '

    foreman-rake templates:purge negate=true

## Integration with other Foreman Plugins

`templates` will start processing a template by looking for a metadata entry of
`model`. If this is found, `templates` will call `import!` on this model.

That means it's possible for a plugin to define it's own handling of text and
metadata, relevant to the plugins own interests. The `import!` method will be
sent 3 arguments - the `name` of the template, the `text` of the template, and
a complete copy of the `metadata`.

As a trivial example for a random plugin, suppose `foreman_nosuchplugin` has
this code:

```
module ForemanNosuchplugin
  class SomeTemplate
    def self.import!(name, text, metadata)
      File.open("/tmp/#{name}",'w') {|f| f.write text }
    end
  end
end
```

Assuming a template had "model: SomeTemplate" in it's metadata, this would then
get written to a file in `/tmp`.

`templates` will expect the `import!` method to return a Hash, containing:

* `:status` (boolean),
* `:diff` (text, may be nil), or
  * `:old` and `:new` (in which case this plugin will calculate the diff)
* :result` (text, may be nil).

## TODO

* Add a button to the UI with Deface to run the rake task

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
