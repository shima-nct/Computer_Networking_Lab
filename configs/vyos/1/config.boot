interfaces {
    ethernet eth0 {
        address "192.168.0.201/24"
    }
    ethernet eth1 {
        address "192.168.201.1/24"
    }
    loopback lo {
    }
    wireless wlan0 {
        physical-device "phy0"
    }
}
nat {
    source {
        rule 100 {
            description "LAN to WAN NAT"
            outbound-interface {
                name "eth0"
            }
            source {
                address "192.168.201.0/24"
            }
            translation {
                address "masquerade"
            }
        }
    }
}
protocols {
    static {
        route 0.0.0.0/0 {
            next-hop 192.168.0.1 {
            }
        }
    }
}
service {
    dhcp-server {
        shared-network-name LAN-ETH1 {
            authoritative
            subnet 192.168.201.0/24 {
                option {
                    default-router "192.168.201.1"
                    name-server "192.168.201.1"
                }
                range 0 {
                    start "192.168.201.100"
                    stop "192.168.201.200"
                }
                subnet-id "20"
            }
        }
    }
    dns {
        forwarding {
            allow-from "192.168.201.0/24"
            listen-address "192.168.201.1"
            name-server 192.168.0.1 {
            }
        }
    }
    ntp {
        allow-client {
            address "127.0.0.0/8"
            address "169.254.0.0/16"
            address "10.0.0.0/8"
            address "172.16.0.0/12"
            address "192.168.0.0/16"
            address "::1/128"
            address "fe80::/10"
            address "fc00::/7"
        }
        server ntp.nict.jp {
        }
    }
    ssh {
    }
}
system {
    config-management {
        commit-revisions "100"
    }
    console {
        device ttyS0 {
            speed "115200"
        }
    }
    host-name "vyos"
    login {
        user vyos {
            authentication {
                encrypted-password "$6$rounds=656000$8WHGCA.hE8EDKpoI$7GUHqohGsXzxppoVHi7RLqL/GZTr7By9Pu/0coTo12waXHADVC.2zRO2w9aFEWqvJFxMGmjw0XILa11EtQJjC0"
                plaintext-password ""
            }
        }
    }
    name-server "192.168.0.1"
    option {
        reboot-on-upgrade-failure "5"
    }
    syslog {
        local {
            facility all {
                level "info"
            }
            facility local7 {
                level "debug"
            }
        }
    }
}


// Warning: Do not remove the following line.
// vyos-config-version: "bgp@6:broadcast-relay@1:cluster@2:config-management@1:conntrack@6:conntrack-sync@2:container@3:dhcp-relay@2:dhcp-server@11:dhcpv6-server@6:dns-dynamic@4:dns-forwarding@4:firewall@19:flow-accounting@1:https@7:ids@1:interfaces@33:ipoe-server@4:ipsec@13:isis@3:l2tp@9:lldp@3:mdns@1:monitoring@2:nat@8:nat66@3:ntp@3:openconnect@3:openvpn@4:ospf@2:pim@1:policy@8:pppoe-server@11:pptp@5:qos@2:quagga@11:reverse-proxy@3:rip@1:rpki@2:salt@1:snmp@3:ssh@2:sstp@6:system@29:vrf@3:vrrp@4:vyos-accel-ppp@2:wanloadbalance@4:webproxy@2"
// Release version: 1.5-stream-2025-Q2
