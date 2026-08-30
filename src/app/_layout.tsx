import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="processing" />
        <Stack.Screen name="product-studio" />
        <Stack.Screen name="recommendation" />
        <Stack.Screen name="review" />
        <Stack.Screen name="success" />
      </Stack>
    </>
  );
}
