export const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  let result = '';

  if (diffInYears > 0) {
    result = `${diffInYears} year${diffInYears > 1 ? 's' : ''}`;
  } else if (diffInMonths > 0) {
    result = `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
  } else if (diffInWeeks > 0) {
    result = `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''}`;
  } else if (diffInDays > 0) {
    result = `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    result = `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInMinutes > 0) {
    result = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else {
    result = 'a few seconds';
  }

  return options?.addSuffix ? `${result} ago` : result;
};