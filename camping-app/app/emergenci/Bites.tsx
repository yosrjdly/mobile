import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Bites = () => {
    const insectBiteInformation = {
        typesOfBites: [
          {
            insect: 'Mosquito',
            symptoms: 'Itchy red bumps, swelling',
            treatment: 'Apply calamine lotion or hydrocortisone cream. Avoid scratching.',
            prevention: 'Use insect repellent, wear long sleeves and pants, and eliminate standing water.'
          },
          {
            insect: 'Tick',
            symptoms: 'Red, raised bump at the bite site, flu-like symptoms in some cases',
            treatment: 'Remove the tick carefully, clean the area with soap and water, monitor for symptoms.',
            prevention: 'Wear protective clothing, use insect repellent, check for ticks after spending time outdoors.'
          },
          {
            insect: 'Bee or Wasp',
            symptoms: 'Pain, swelling, redness at the bite site',
            treatment: 'Remove the stinger if present, apply a cold compress, take an over-the-counter antihistamine.',
            prevention: 'Avoid wearing perfumes or bright colors, be cautious when eating outdoors.'
          }
        ],
        generalTips: [
          'Avoid scratching the bite to prevent infection.',
          'Over-the-counter pain relievers can help with discomfort.',
          'Seek medical attention if symptoms worsen or if you experience an allergic reaction.'
        ]
      };
  return (
    <View>
      <Text>Bites</Text>
    </View>
  )
}

export default Bites

const styles = StyleSheet.create({})