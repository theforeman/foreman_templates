require 'json'

module ForemanTemplates
  class RubocopJsonProcessor
    def initialize(json_file)
      @report = JSON.parse(File.read(json_file))
    end

    def to_clang
      @report['files'].each do |file_report|
        report_file(file_report['path'], file_report['offenses'])
      end
    end

    private

    def report_file(filename, offenses)
      report "File: \"#{filename}\""
      buffer = File.read(filename)
      lines = buffer.split("\n")

      offenses.each do |offense_report|
        report_offense(lines, offense_report)
      end
    end

    def report_offense(lines, offense)
      report "Message: #{offense['message']}"
      report 'Source:'
      report_source(lines, offense['location'])
    end

    def report_source(lines, location)
      report lines[location['line'] - 1]

      highlight = (' ' * (location['column'] - 1)) + ('^' * location['length'])
      report highlight
    end

    def report(line)
      puts line
    end
  end
end
