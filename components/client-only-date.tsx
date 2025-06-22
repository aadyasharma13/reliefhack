"use client";

import { useState, useEffect } from 'react';

interface ClientOnlyDateProps {
  dateString: string;
}

export default function ClientOnlyDate({ dateString }: ClientOnlyDateProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render nothing on the server or during the initial client render
    return null;
  }

  // Once mounted on the client, render the formatted date
  return <span>{new Date(dateString).toLocaleDateString()}</span>;
} 