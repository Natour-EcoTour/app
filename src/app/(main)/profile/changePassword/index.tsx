import { images } from '@/src/utils/assets';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';

export default function Profile() {
    return (
        <ImageBackground
            source={images.background}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View>
                <Text>Alterar Senha</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
