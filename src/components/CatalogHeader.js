// CatalogHeader.js
import React from 'react';
import { Box, Flex, Text, Button, Spacer, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const CatalogHeader = () => {
  return (
    <Box bg="teal.500" p={4} color="white">
      <Flex alignItems="center">
        {/* Логотип */}
        <Text fontSize="2xl" fontWeight="bold">Dota Market</Text>

        <Spacer />

        {/* Поле пошуку */}
        <InputGroup size="md" w="40%">
          <Input placeholder="Пошук товарів..." borderRadius="md" />
          <InputRightElement>
            <Button size="sm" bg="teal.700" color="white">
              <SearchIcon />
            </Button>
          </InputRightElement>
        </InputGroup>

        <Spacer />

        {/* Кнопки */}
        <Button bg="white" color="teal.500" borderRadius="md" mx={2} _hover={{ bg: 'teal.600', color: 'white' }}>Увійти</Button>
        <Button bg="teal.700" color="white" borderRadius="md" mx={2} _hover={{ bg: 'teal.600' }}>Зареєструватися</Button>
      </Flex>
    </Box>
  );
};

export default CatalogHeader;