import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User, CheckCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onNavigateToNotification: (notification: Notification) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
  onMarkRead,
  onNavigateToNotification
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
      <div className="px-3 sm:px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm p-1"
        >
          ✕
        </button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="px-3 sm:px-4 py-8 text-center text-gray-500">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-3 sm:px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (!notification.read) {
                  onMarkRead(notification.id);
                }
                onNavigateToNotification(notification);
                onClose();
              }}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;