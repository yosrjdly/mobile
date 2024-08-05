import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const campingIssues = {
    issues: [
        {
            title: 'Unexpected Rainstorm',
            description: 'Heavy rain and wind caught the campers off guard, soaking their tents and gear.'
        },
        {
            title: 'Campfire Accident',
            description: 'A sudden gust of wind spread embers, causing minor burns and a small fire scare.'
        },
        {
            title: 'Wild Animal Encounter',
            description: 'A curious raccoon rummaged through food supplies, leading to a frantic effort to secure the campsite.'
        },
        {
            title: 'Lost Hiker',
            description: 'One camper wandered off the trail, resulting in a coordinated search and eventual safe return.'
        },
        {
            title: 'Food Poisoning',
            description: 'Improperly stored food led to a bout of food poisoning among a few campers.'
        },
        {
            title: 'Insect Bites and Allergies',
            description: 'Multiple campers experienced severe reactions to bug bites, requiring quick medical attention.'
        },
        {
            title: 'Equipment Failure',
            description: 'A tent collapsed during the night due to a broken pole, leaving campers scrambling for shelter.'
        }
    ],
    generalTips: [
        'Always check the weather forecast before heading out.',
        'Store food securely to avoid attracting animals.',
        'Have a plan and know the trails to prevent getting lost.'
    ]
};

const Others = () => {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('emergenci')}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Camping Issues</Text>
            <View style={styles.header}>
                <Image source={{ uri: 'https://cdn.outsideonline.com/wp-content/uploads/2021/06/15/camping_fun_s.jpg' }} style={styles.icon} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Common Issues</Text>
                {campingIssues.issues.map((issue, index) => (
                    <View key={index} style={styles.levelItem}>
                        <Text style={styles.levelTitle}>* {issue.title}</Text>
                        <Text style={styles.content}>{issue.description}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General Tips</Text>
                {campingIssues.generalTips.map((tip, index) => (
                    <Text key={index} style={styles.content}>- {tip}</Text>
                ))}
            </View>
        </ScrollView>
    );
}

export default Others;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00595E',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#073436',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#B3492D',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    content: {
        marginBottom: 20,
        color: '#fff',
    },
    levelItem: {
        marginBottom: 10,
    },
    levelTitle: {
        fontWeight: 'bold',
        color: '#fff',
    },
    icon: {
        width: 330,
        height: 290,
        marginRight: 20,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
    },
});
