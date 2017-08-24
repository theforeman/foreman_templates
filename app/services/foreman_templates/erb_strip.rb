module ForemanTemplates
  class ErbStrip
    ERB_REGEX = /(?<start_tag><%[-=]?)(?<script>([^#]).*?)(?<end_tag>-?%>)/m

    def initialize(source)
      @source = source
    end

    def strip
      out = ''
      current_position = 0
      while (match = next_erb(current_position))
        out << fill_newlines(current_position, match.begin(2) - 1)
        out << match[:script]
        out << ';'
        out << ' ' * (match[:end_tag].length - 1)
        current_position = match.end(3)
      end
      out
    end

    def next_erb(start_pos)
      @source.match(ERB_REGEX, start_pos)
    end

    def fill_newlines(start, finish)
      newlines = @source[start..finish].split("\n")
      newlines.map { |line| ' ' * line.length }.join("\n")
    end
  end
end
