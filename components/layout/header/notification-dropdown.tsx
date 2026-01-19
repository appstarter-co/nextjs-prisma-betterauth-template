"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile";
import notificationsData from "./notification.json";

interface Notification {
  id: string;
  sender: string;
  action: string;
  target: string;
  category: string;
  timestamp: string;
  isOnline: boolean;
  isRead: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData.notifications);
  const isMobile = useIsMobile();

  // Function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to get avatar background color based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Mark notification as read when clicked
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {hasUnread && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <Bell className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-[350px] max-h-[480px] flex flex-col" side="bottom" align="end">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h5 className="text-lg font-semibold">Notifications</h5>
            {hasUnread && (
              <button
                onClick={markAllAsRead}
                className="text-sm hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex gap-3 p-4 border-b cursor-pointer`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(notification.sender)}`}
                  >
                    {getInitials(notification.sender)}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      notification.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{notification.sender}</span>
                    {' '}{notification.action}{' '}
                    <span className="font-medium">{notification.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.category} • {notification.timestamp}
                  </p>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </DropdownMenuItem>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t">
            <Link
              href="/notifications"
              className="block w-full text-center py-2 text-sm hover:text-blue-800"
            >
              View All Notifications
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}