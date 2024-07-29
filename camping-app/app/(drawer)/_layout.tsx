import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false}}
    >
      <Drawer.Screen
        name="mycamps"
        options={{
          drawerLabel: "mycamps",
          title: "mycamps",
        }}
      />
    </Drawer>
  );
}