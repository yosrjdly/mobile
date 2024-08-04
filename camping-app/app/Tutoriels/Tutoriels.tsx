import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';

// Sample images for demonstration (replace with actual URLs or local paths)
const images = {
  tent: 'https://m.media-amazon.com/images/I/81ATB95Dc7L._AC_UF1000,1000_QL80_.jpg',
  sleepingBag: 'https://puffy.com/cdn/shop/articles/Best_Summer_Sleeping_Bag_1024x.webp?v=1710144257',
  sleepingPad: 'https://cld.accentuate.io/441503318290/1680683522112/Sea-to-Summit_Air-Sleeping-Mat.jpg?v=1680683522112&options=w_1440',
  pillow: 'https://www.switchbacktravel.com/sites/default/files/articles%20/Camping%20and%20backpacking%20pillows%20%28lined%20up%20on%20sleeping%20bag%20-%20m%29.jpg',
  stove: 'https://www.switchbacktravel.com/sites/default/files/articles%20/Camping%20stove%20%28Camp%20Chef%20Everest%202X%20on%20picnic%20table%20-%20m%29.jpeg',
  cookware: 'https://m.media-amazon.com/images/I/81Igj-k8wrL._AC_UF350,350_QL80_.jpg',
  cooler: 'https://images.craigslist.org/00505_hODCwqKaUpH_0CI0pO_600x450.jpg',
  waterBottle: 'https://b1612155.smushcdn.com/1612155/wp-content/uploads/2020/08/reusable-water-bottles-on-camping-table.jpg?lossy=2&strip=1&webp=1',
  food: 'https://recipes.net/wp-content/uploads/2024/01/how-to-eat-while-camping-1706094847.jpg',
  utensils: 'https://www.outdoorlife.com/wp-content/uploads/2022/04/28/BestCampingUtensils_Feature.jpg',
  clothing: 'https://kamui.co/wp-content/uploads/2021/12/packing-clothes-01.jpg',
  boots: 'https://www.switchbacktravel.com/sites/default/files/image_fields/Best%20Of%20Gear%20Articles/Hiking%20and%20Backpacking/Hiking%20Boots/Salewa%20Mountain%20Trainer%20Lite%20Mid%20GTX%20hiking%20boot%20%28closeup%20of%20boots%29.jpeg',
  hat: 'https://m.media-amazon.com/images/I/61OXGjPRYrL._AC_UY1000_.jpg',
  rainGear: 'https://d3oq6855v51t2q.cloudfront.net/getmedia/ac4f2cd1-7d0c-4dec-a369-2ff437056502/Rain%20cover_2.jpg',
  map: 'https://www.familyhandyman.com/wp-content/uploads/2023/05/GettyImages-114218915.jpg',
  firstAidKit: 'https://www.lifesystems.co.uk/cdn/shop/files/20210-camping-first-aid-kit-4.jpg?height=1100&v=1697707218&width=1100',
  multiTool: 'https://www.rollingstone.com/wp-content/uploads/2020/03/best-multitool.jpg?w=831&h=554&crop=1',
  headlamp: 'https://windsormail.com.au/cdn/shop/products/08_2bjlubjkytteg9i0_800x.jpg?v=1611472804',
  fireStarters: 'https://cdn.shopify.com/s/files/1/0384/0233/files/fire-starter-2.jpg?v=1621859481',
  toiletries: 'https://escapesetc.com/wp-content/uploads/2019/01/20-Essential-toiletries-for-backpacking.jpg',
  bugRepellent: 'https://cdn.actionhub.com/wp-content/uploads/2021/02/bg-best-bug-repellent-Simon-Kadula.jpg',
  sunscreen: 'https://d1azn61i9hwokk.cloudfront.net/image_banner/big/The-Safari-Store-Best-Sunscreen-For-Camping.jpg',
  campChairs: 'https://www.roamadventureco.com/cdn/shop/files/R--7-2_x700.jpg?v=1685981340',
  trashBags: 'https://koa.com/blog/images/trash-bag.jpg?preset=blogPhoto',
  backpack: 'https://d1nymbkeomeoqg.cloudfront.net/photos/27/70/398485_31623_XL.jpg',
  tarp: 'https://cdn.shopify.com/s/files/1/2930/3092/files/Blog_Body_600_x_400px_10_1024x1024.png?v=1695881541',
  rope: 'https://i5.walmartimages.com/asr/9699e492-c75d-45ad-8066-fe42b6368009.b4f563194a0b22118236064f6b9dc0c5.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
  lantern: 'https://cdn.outsideonline.com/wp-content/uploads/migrated-images_parent/migrated-images_74/camping-lanterns-main_fe.jpg',
  repairKit: 'https://hawknesthammocks.ca/cdn/shop/articles/DALL_E_2024-05-30_10.47.46_-_A_captivating_wide_header_image_of_a_hammock_tent_repair_kit_in_use_in_a_serene_outdoor_camping_setting._The_image_shows_a_camper_fixing_a_small_tear.webp?v=1717091298&width=1100',
  powerBank: 'https://cdn.mos.cms.futurecdn.net/fhNfnN8ikwjLG8FRWJysqM.jpg',
  binoculars: 'https://bearfoottheory.com/wp-content/uploads/2022/01/Hiking-Binoculars.jpeg',
  fishingGear: 'https://www.insidehook.com/wp-content/uploads/2022/03/Everything-you-need-to-get-into-fly-fishing.jpg?fit=1200%2C675',
  camera: 'https://st3.depositphotos.com/2356853/12638/i/950/depositphotos_126388026-stock-photo-lifestyle-hiking-camping-equipment-retro.jpg',
  hammock: 'https://www.hammockuniverse.com/cdn/shop/articles/Hammock-Universe-Blog-Featured-Image-HAMMOCK-CAMPING-IN-COLD-RAINY-WEATHER-HERES-THE-GUIDE-TO-KEEP-YOU-WARM-DRY_900x.jpg?v=1678800688',
};

const CampingEssentials = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Camping Essentials: A Guide to a Successful Trip</Text>

      {/* Shelter and Sleeping */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Shelter and Sleeping</Text>
        <Text style={styles.item}>Tent:</Text>
        <Image source={{ uri: images.tent }} style={styles.image} />
        <Text style={styles.description}>
          Choose based on size (number of campers) and weather conditions. Look for a waterproof and windproof option with good ventilation.
        </Text>
        
        <Text style={styles.item}>Sleeping Bag:</Text>
        <Image source={{ uri: images.sleepingBag }} style={styles.image} />
        <Text style={styles.description}>
          Pick one suitable for the season and temperature. Consider the shape (mummy, rectangular) and insulation material (down, synthetic).
        </Text>

        <Text style={styles.item}>Sleeping Pad or Air Mattress:</Text>
        <Image source={{ uri: images.sleepingPad }} style={styles.image} />
        <Text style={styles.description}>
          Provides insulation and comfort. Options include foam pads, inflatable pads, and self-inflating pads.
        </Text>

        <Text style={styles.item}>Pillow:</Text>
        <Image source={{ uri: images.pillow }} style={styles.image} />
        <Text style={styles.description}>
          Compact, inflatable, or compressible pillows designed for camping.
        </Text>
      </View>

      {/* Cooking and Eating */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Cooking and Eating</Text>
        <Text style={styles.item}>Camping Stove:</Text>
        <Image source={{ uri: images.stove }} style={styles.image} />
        <Text style={styles.description}>
          Portable stoves using propane, butane, or multi-fuel. Ensure you have enough fuel for your trip.
        </Text>

        <Text style={styles.item}>Cookware:</Text>
        <Image source={{ uri: images.cookware }} style={styles.image} />
        <Text style={styles.description}>
          Pots, pans, and utensils designed for camping. Lightweight and durable materials like aluminum or titanium.
        </Text>

        <Text style={styles.item}>Cooler:</Text>
        <Image source={{ uri: images.cooler }} style={styles.image} />
        <Text style={styles.description}>
          Keeps perishable food and drinks cold. Consider size and insulation capabilities.
        </Text>

        <Text style={styles.item}>Water Bottle or Hydration System:</Text>
        <Image source={{ uri: images.waterBottle }} style={styles.image} />
        <Text style={styles.description}>
          Reusable water bottles or hydration bladders for easy drinking.
        </Text>

        <Text style={styles.item}>Food:</Text>
        <Image source={{ uri: images.food }} style={styles.image} />
        <Text style={styles.description}>
          Non-perishable, easy-to-cook meals like canned goods, dehydrated meals, and snacks.
        </Text>

        <Text style={styles.item}>Eating Utensils:</Text>
        <Image source={{ uri: images.utensils }} style={styles.image} />
        <Text style={styles.description}>
          Lightweight and durable cutlery, plates, bowls, and cups.
        </Text>
      </View>

      {/* Clothing and Footwear */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Clothing and Footwear</Text>
        <Text style={styles.item}>Layered Clothing:</Text>
        <Image source={{ uri: images.clothing }} style={styles.image} />
        <Text style={styles.description}>
          Base layer (moisture-wicking), mid-layer (insulating), and outer layer (weatherproof).
        </Text>

        <Text style={styles.item}>Hiking Boots or Shoes:</Text>
        <Image source={{ uri: images.boots }} style={styles.image} />
        <Text style={styles.description}>
          Sturdy, comfortable, and appropriate for the terrain.
        </Text>

        <Text style={styles.item}>Extra Socks and Underwear:</Text>
        <Text style={styles.description}>
          Quick-drying and moisture-wicking materials.
        </Text>

        <Text style={styles.item}>Hat and Gloves:</Text>
        <Image source={{ uri: images.hat }} style={styles.image} />
        <Text style={styles.description}>
          For sun protection and warmth, depending on the season.
        </Text>

        <Text style={styles.item}>Rain Gear:</Text>
        <Image source={{ uri: images.rainGear }} style={styles.image} />
        <Text style={styles.description}>
          Waterproof jacket and pants.
        </Text>
      </View>

      {/* Navigation and Safety */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Navigation and Safety</Text>
        <Text style={styles.item}>Map and Compass/GPS:</Text>
        <Image source={{ uri: images.map }} style={styles.image} />
        <Text style={styles.description}>
          Essential for navigation, especially in remote areas.
        </Text>

        <Text style={styles.item}>First Aid Kit:</Text>
        <Image source={{ uri: images.firstAidKit }} style={styles.image} />
        <Text style={styles.description}>
          Include bandages, antiseptics, pain relievers, and any personal medications.
        </Text>

        <Text style={styles.item}>Multi-Tool or Knife:</Text>
        <Image source={{ uri: images.multiTool }} style={styles.image} />
        <Text style={styles.description}>
          Versatile tool for various tasks.
        </Text>

        <Text style={styles.item}>Headlamp or Flashlight:</Text>
        <Image source={{ uri: images.headlamp }} style={styles.image} />
        <Text style={styles.description}>
          Hands-free lighting with extra batteries.
        </Text>

        <Text style={styles.item}>Fire Starters:</Text>
        <Image source={{ uri: images.fireStarters }} style={styles.image} />
        <Text style={styles.description}>
          Matches, lighters, and fire-starting materials.
        </Text>
      </View>

      {/* Personal Items and Comfort */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Personal Items and Comfort</Text>
        <Text style={styles.item}>Toiletries:</Text>
        <Image source={{ uri: images.toiletries }} style={styles.image} />
        <Text style={styles.description}>
          Biodegradable soap, toothbrush, toothpaste, toilet paper, and a small towel.
        </Text>

        <Text style={styles.item}>Bug Repellent:</Text>
        <Image source={{ uri: images.bugRepellent }} style={styles.image} />
        <Text style={styles.description}>
          Protects against insects.
        </Text>

        <Text style={styles.item}>Sunscreen:</Text>
        <Image source={{ uri: images.sunscreen }} style={styles.image} />
        <Text style={styles.description}>
          Protects from harmful UV rays.
        </Text>

        <Text style={styles.item}>Camp Chairs:</Text>
        <Image source={{ uri: images.campChairs }} style={styles.image} />
        <Text style={styles.description}>
          Lightweight and foldable for comfortable seating.
        </Text>

        <Text style={styles.item}>Trash Bags:</Text>
        <Image source={{ uri: images.trashBags }} style={styles.image} />
        <Text style={styles.description}>
          For packing out all garbage and keeping the campsite clean.
        </Text>
      </View>

      {/* Miscellaneous */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Miscellaneous</Text>
        <Text style={styles.item}>Backpack:</Text>
        <Image source={{ uri: images.backpack }} style={styles.image} />
        <Text style={styles.description}>
          Size depends on the length of the trip; consider comfort and capacity.
        </Text>

        <Text style={styles.item}>Tarp or Groundsheet:</Text>
        <Image source={{ uri: images.tarp }} style={styles.image} />
        <Text style={styles.description}>
          For extra protection under your tent or as a makeshift shelter.
        </Text>

        <Text style={styles.item}>Rope or Paracord:</Text>
        <Image source={{ uri: images.rope }} style={styles.image} />
        <Text style={styles.description}>
          Useful for setting up shelters, clotheslines, and other needs.
        </Text>

        <Text style={styles.item}>Lantern:</Text>
        <Image source={{ uri: images.lantern }} style={styles.image} />
        <Text style={styles.description}>
          Provides ambient light around the campsite.
        </Text>

        <Text style={styles.item}>Repair Kit:</Text>
        <Image source={{ uri: images.repairKit }} style={styles.image} />
        <Text style={styles.description}>
          For tents, sleeping pads, and other gear.
        </Text>
      </View>

      {/* Optional but Useful */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Optional but Useful</Text>
        <Text style={styles.item}>Portable Power Bank:</Text>
        <Image source={{ uri: images.powerBank }} style={styles.image} />
        <Text style={styles.description}>
          For charging electronic devices.
        </Text>

        <Text style={styles.item}>Binoculars:</Text>
        <Image source={{ uri: images.binoculars }} style={styles.image} />
        <Text style={styles.description}>
          For wildlife viewing.
        </Text>

        <Text style={styles.item}>Fishing Gear:</Text>
        <Image source={{ uri: images.fishingGear }} style={styles.image} />
        <Text style={styles.description}>
          If you plan to fish.
        </Text>

        <Text style={styles.item}>Camera:</Text>
        <Image source={{ uri: images.camera }} style={styles.image} />
        <Text style={styles.description}>
          To capture memories of your trip.
        </Text>

        <Text style={styles.item}>Hammock:</Text>
        <Image source={{ uri: images.hammock }} style={styles.image} />
        <Text style={styles.description}>
          For relaxation and enjoying the outdoors.
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    padding: 15,
    marginTop:20 
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#003D34',
    borderRadius: 8,
    padding: 12,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    color: '#E0E0E0',
    fontSize: 16,
  },
});

export default CampingEssentials;
