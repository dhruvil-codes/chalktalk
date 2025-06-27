// src/components/BoltBadge.tsx
import { Button } from '@mantine/core';

function BoltBadge() {
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
      <Button
        size="md"
        color="lime"
        variant="filled"
        component="a"
        href="https://bolt.new"
        target="_blank"
        style={{ cursor: 'pointer', fontWeight: 600, fontSize: 16, letterSpacing: 0.2 }}
        radius="md"
      >
        Built with Bolt ⚡
      </Button>
    </div>
  );
}

export default BoltBadge;
