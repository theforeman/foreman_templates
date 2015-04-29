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

There is UI no configuration at this time.

## Usage

The plugin provides a Rake task to import the templates. To use it, simply do

    foreman-rake templates:sync

This will create a set of templates named "Community ...." (or update them if they
already exist). Audit history is preserved, but no comment is currently added for
any changes made.

The importer will attempt to figure out the OS and Release the template refers to. If
this is a new template being created, and we can find a matching OS in Foreman, the
template will be automatically associated with the OS

# Rake options

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

## Examples

Just import all the templates in from the default repo

    foreman-rake templates:sync

Import all templates from a custom repo, with a different prefix

    foreman-rake templates:sync repo="http://github.com/GregSutcliffe/community-templates" prefix="Greg"

Import templates matching the name "Fedora"

    foreman-rake templates:sync filter='fedora'

Import templates from a subsection of a git repo:

    foreman-rake templates:sync repo="http://github.com/GregSutcliffe/community-templates" dirname='/subdir'

## TODO

* Allow user to filter to a specific subset of templates
* Add associations by template family
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
