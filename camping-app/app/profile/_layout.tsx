// app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import DrawerContent from '../../components/DrawerContent';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Drawer drawerContent={() => <DrawerContent />}  />
    </GestureHandlerRootView>
  );
}
