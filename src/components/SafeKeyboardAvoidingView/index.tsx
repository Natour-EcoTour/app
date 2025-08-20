import { KeyboardAvoidingView, Platform, KeyboardAvoidingViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeKeyboardAvoidingViewProps extends Omit<KeyboardAvoidingViewProps, 'keyboardVerticalOffset' | 'behavior'> {
  behavior?: KeyboardAvoidingViewProps['behavior'];
  additionalOffset?: number;
}

export default function SafeKeyboardAvoidingView({ 
  children, 
  style,
  behavior,
  additionalOffset = 16,
  ...props 
}: SafeKeyboardAvoidingViewProps) {
  const insets = useSafeAreaInsets();
  
  const keyboardOffset = Platform.select({
    ios: insets.top + additionalOffset,
    android: 0,
  });

  const keyboardBehavior = behavior || Platform.select({
    ios: 'padding' as const,
    android: 'height' as const,
  });

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={keyboardOffset}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
