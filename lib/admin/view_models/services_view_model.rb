require 'date'
require 'thread'
require_relative 'base_view_model'

module AdminUI
  class ServicesViewModel < AdminUI::BaseViewModel
    def do_items
      services = @cc.services

      # services have to exist.  Other record types are optional
      return result unless services['connected']

      events                    = @cc.events
      service_bindings          = @cc.service_bindings
      service_brokers           = @cc.service_brokers
      service_instances         = @cc.service_instances
      service_keys              = @cc.service_keys
      service_plans             = @cc.service_plans
      service_plan_visibilities = @cc.service_plan_visibilities

      events_connected                    = events['connected']
      service_bindings_connected          = service_bindings['connected']
      service_instances_connected         = service_instances['connected']
      service_keys_connected              = service_keys['connected']
      service_plans_connected             = service_plans['connected']
      service_plan_visibilities_connected = service_plan_visibilities['connected']

      service_broker_hash   = Hash[service_brokers['items'].map { |item| [item[:id], item] }]
      service_instance_hash = Hash[service_instances['items'].map { |item| [item[:id], item] }]
      service_plan_hash     = Hash[service_plans['items'].map { |item| [item[:id], item] }]

      event_counters = {}
      events['items'].each do |event|
        return result unless @running
        Thread.pass

        next unless event[:actee_type] == 'service'
        actee = event[:actee]
        event_counters[actee] = 0 if event_counters[actee].nil?
        event_counters[actee] += 1
      end

      service_plan_counters = {}
      service_plan_public_active_counters = {}
      service_plans['items'].each do |service_plan|
        return result unless @running
        Thread.pass

        service_id = service_plan[:service_id]
        service_plan_counters[service_id] = 0 if service_plan_counters[service_id].nil?
        service_plan_counters[service_id] += 1

        next unless service_plan[:public] && service_plan[:active]
        service_plan_public_active_counters[service_id] = 0 if service_plan_public_active_counters[service_id].nil?
        service_plan_public_active_counters[service_id] += 1
      end

      service_plan_visibility_counters = {}
      service_plan_visibilities['items'].each do |service_plan_visibility|
        return result unless @running
        Thread.pass

        service_plan_id = service_plan_visibility[:service_plan_id]
        next if service_plan_id.nil?
        service_plan = service_plan_hash[service_plan_id]
        next if service_plan.nil?
        service_id = service_plan[:service_id]
        service_plan_visibility_counters[service_id] = 0 if service_plan_visibility_counters[service_id].nil?
        service_plan_visibility_counters[service_id] += 1
      end

      service_instance_counters = {}
      service_instances['items'].each do |service_instance|
        return result unless @running
        Thread.pass

        service_plan_id = service_instance[:service_plan_id]
        next if service_plan_id.nil?
        service_plan = service_plan_hash[service_plan_id]
        next if service_plan.nil?
        service_id = service_plan[:service_id]
        service_instance_counters[service_id] = 0 if service_instance_counters[service_id].nil?
        service_instance_counters[service_id] += 1
      end

      service_binding_counters = {}
      service_bindings['items'].each do |service_binding|
        return result unless @running
        Thread.pass

        service_instance_id = service_binding[:service_instance_id]
        next if service_instance_id.nil?
        service_instance = service_instance_hash[service_instance_id]
        next if service_instance.nil?
        service_plan_id = service_instance[:service_plan_id]
        next if service_plan_id.nil?
        service_plan = service_plan_hash[service_plan_id]
        next if service_plan.nil?
        service_id = service_plan[:service_id]
        service_binding_counters[service_id] = 0 if service_binding_counters[service_id].nil?
        service_binding_counters[service_id] += 1
      end

      service_key_counters = {}
      service_keys['items'].each do |service_key|
        return result unless @running
        Thread.pass

        service_instance_id = service_key[:service_instance_id]
        next if service_instance_id.nil?
        service_instance = service_instance_hash[service_instance_id]
        next if service_instance.nil?
        service_plan_id = service_instance[:service_plan_id]
        next if service_plan_id.nil?
        service_plan = service_plan_hash[service_plan_id]
        next if service_plan.nil?
        service_id = service_plan[:service_id]
        service_key_counters[service_id] = 0 if service_key_counters[service_id].nil?
        service_key_counters[service_id] += 1
      end

      items = []
      hash  = {}

      services['items'].each do |service|
        return result unless @running
        Thread.pass

        guid           = service[:guid]
        id             = service[:id]
        service_broker = service_broker_hash[service[:service_broker_id]]

        event_counter                      = event_counters[guid]
        service_binding_counter            = service_binding_counters[id]
        service_instance_counter           = service_instance_counters[id]
        service_key_counter                = service_key_counters[id]
        service_plan_counter               = service_plan_counters[id]
        service_plan_public_active_counter = service_plan_public_active_counters[id]
        service_plan_visibility_counter    = service_plan_visibility_counters[id]

        row = []

        row.push(guid)
        row.push(service[:provider])
        row.push(service[:label])
        row.push(guid)
        row.push(service[:unique_id])
        row.push(service[:version])
        row.push(service[:created_at].to_datetime.rfc3339)

        if service[:updated_at]
          row.push(service[:updated_at].to_datetime.rfc3339)
        else
          row.push(nil)
        end

        row.push(service[:active])
        row.push(service[:bindable])
        row.push(service[:plan_updateable])

        if event_counter
          row.push(event_counter)
        elsif events_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_plan_counter
          row.push(service_plan_counter)
        elsif service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_plan_public_active_counter
          row.push(service_plan_public_active_counter)
        elsif service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_plan_visibility_counter
          row.push(service_plan_visibility_counter)
        elsif service_plan_visibilities_connected && service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_instance_counter
          row.push(service_instance_counter)
        elsif service_instances_connected && service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_binding_counter
          row.push(service_binding_counter)
        elsif service_bindings_connected && service_instances_connected && service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_key_counter
          row.push(service_key_counter)
        elsif service_keys_connected && service_instances_connected && service_plans_connected
          row.push(0)
        else
          row.push(nil)
        end

        if service_broker
          row.push(service_broker[:name])
          row.push(service_broker[:guid])
          row.push(service_broker[:created_at].to_datetime.rfc3339)

          if service_broker[:updated_at]
            row.push(service_broker[:updated_at].to_datetime.rfc3339)
          else
            row.push(nil)
          end
        else
          row.push(nil, nil, nil, nil)
        end

        items.push(row)

        hash[guid] =
          {
            'service'        => service,
            'service_broker' => service_broker
          }
      end

      result(true, items, hash, (1..21).to_a, (1..21).to_a - [11, 12, 13, 14, 15, 16, 17])
    end
  end
end
