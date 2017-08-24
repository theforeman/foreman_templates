# frozen_string_literal: true

module RuboCop
  module Cop
    module Foreman
      # This cop checks for calls to foreman_url without params
      class ForemanUrl < Cop
        MSG = 'Call foreman_url with (\'built\') `%s`.'.freeze

        def_node_matcher :foreman_url_call?, <<-PATTERN
          (send nil :foreman_url)
        PATTERN

        def on_send(node)
          return unless foreman_url_call?(node)

          add_offense(node, :expression)
        end

        private

        def message(node)
          format(MSG, node.source)
        end
      end
    end
  end
end
