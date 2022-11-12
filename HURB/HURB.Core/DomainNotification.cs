using Flunt.Notifications;

namespace HURB.Core
{
    public class DomainNotification
    {
        private readonly List<Notification> _notifications;
        public IReadOnlyCollection<Notification> Notifications => _notifications;
        public bool HasNotifications => _notifications.Any();

        public DomainNotification()
            => _notifications = new List<Notification>();

        public void AddNotification(string key, string message)
           => _notifications.Add(new Notification(key, message));

        public void AddNotifications(IReadOnlyCollection<Notification> notifications)
            => _notifications.AddRange(notifications);

        public void AddNotifications(IList<Notification> notifications)
            => _notifications.AddRange(notifications);
    }
}
