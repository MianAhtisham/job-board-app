'use client';
import React from 'react';

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString).getTime();
  if (isNaN(date)) return '';
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 5) return 'just now';
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  for (const [unitSeconds, unitName] of intervals) {
    const count = Math.floor(seconds / unitSeconds);
    if (count >= 1) return `${count} ${unitName}${count > 1 ? 's' : ''} ago`;
  }
  return '';
}

export default function TimeAgo({ createdAt }: { createdAt: string }) {
  const [label, setLabel] = React.useState(() => formatTimeAgo(createdAt));

  React.useEffect(() => {
    setLabel(formatTimeAgo(createdAt));
    const t = setInterval(() => setLabel(formatTimeAgo(createdAt)), 60000);
    return () => clearInterval(t);
  }, [createdAt]);

  return <span>{label}</span>;
}