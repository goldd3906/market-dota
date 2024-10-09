import React, { useState } from 'react';
import { Box, Grid, Image, Text, Stack, Checkbox, Slider, Button, Select, Heading, Input } from '@chakra-ui/react';

const items = [
  { id: 1, name: 'Item 1', rarity: 'common', price: 10, image: '/path/to/image1.jpg' },
  { id: 2, name: 'Item 2', rarity: 'rare', price: 50, image: '/path/to/image2.jpg' },
  { id: 3, name: 'Item 3', rarity: 'legendary', price: 100, image: '/path/to/image3.jpg' },
  // Add more items here...
];

const CatalogPage = () => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedRarity, setSelectedRarity] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRarityChange = (e) => {
    const value = e.target.value;
    if (selectedRarity.includes(value)) {
      setSelectedRarity(selectedRarity.filter((r) => r !== value));
    } else {
      setSelectedRarity([...selectedRarity, value]);
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterItems = () => {
    const filtered = items.filter(
      (item) =>
        (selectedRarity.length === 0 || selectedRarity.includes(item.rarity)) &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1] &&
        item.name.toLowerCase().includes(searchQuery)
    );
    setFilteredItems(filtered);
  };

  return (
    <Box p={4} bg="#f5f5f5">
      <Heading as="h1" size="lg" mb={4} textAlign="center">
        Каталог товарів
      </Heading>
      <Box display="flex" justifyContent="space-between">
        {/* Sidebar filters */}
        <Box width="25%" p={4} bg="white" boxShadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>
            Фільтри
          </Heading>

          <Text fontWeight="bold" mb={2}>Рідкість</Text>
          <Stack spacing={2} mb={4}>
            <Checkbox value="common" onChange={handleRarityChange}>Common</Checkbox>
            <Checkbox value="rare" onChange={handleRarityChange}>Rare</Checkbox>
            <Checkbox value="legendary" onChange={handleRarityChange}>Legendary</Checkbox>
          </Stack>

          <Text fontWeight="bold" mb={2}>Ціна</Text>
          <Slider
            defaultValue={[0, 100]}
            min={0}
            max={100}
            step={5}
            onChange={handlePriceChange}
            colorScheme="teal"
            mb={4}
          />

          <Text fontWeight="bold" mb={2}>Пошук</Text>
          <Input placeholder="Пошук товарів..." onChange={handleSearchChange} mb={4} />

          <Button colorScheme="teal" onClick={filterItems} width="full">
            Застосувати фільтри
          </Button>
        </Box>

        {/* Main content with items */}
        <Box width="70%" p={4}>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <Box key={item.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="sm">
                  <Image src={item.image} alt={item.name} objectFit="cover" boxSize="200px" />
                  <Text mt={2} fontSize="lg" fontWeight="bold">{item.name}</Text>
                  <Text>Рідкість: {item.rarity}</Text>
                  <Text>Ціна: ${item.price}</Text>
                </Box>
              ))
            ) : (
              <Text>Товарів не знайдено</Text>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CatalogPage;
