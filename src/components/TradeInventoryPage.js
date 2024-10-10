import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import {
  Box,
  Button,
  Flex,
  Text,
  Grid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Heading,       // Доданий імпорт для Heading
  Spinner        // Доданий імпорт для Spinner
} from '@chakra-ui/react';

import axios from 'axios';
import './TradeInventoryPage.css';

const TradeInventoryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inventory, setInventory] = useState([]);
  const [itemsForSale, setItemsForSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceModal, setPriceModal] = useState({ isOpen: false, price: '' });
  const [commission, setCommission] = useState(0);
  const [editPriceModal, setEditPriceModal] = useState({ isOpen: false, item: null, price: '' });

  // Завантаження інвентаря
  const loadInventory = () => {
    setLoading(true);
    axios.get('http://localhost:5001/api/inventory', { withCredentials: true })
      .then(response => {
        const filteredInventory = response.data.filter(
          (item) => !itemsForSale.some((saleItem) => saleItem.id === item.id)
        );
        setInventory(filteredInventory);
        setLoading(false);
      })
      .catch(error => {
        console.error('Помилка завантаження інвентаря:', error);
        setError('Не вдалося завантажити інвентар. Спробуйте ще раз.');
        setLoading(false);
      });
  };

  // Завантаження предметів у продажі
  const loadItemsForSale = () => {
    axios.get('http://localhost:5001/api/items-for-sale', { withCredentials: true })
      .then(response => {
        setItemsForSale(response.data);
      })
      .catch(error => {
        console.error('Помилка завантаження предметів у продажі:', error);
      });
  };

  useEffect(() => {
    loadItemsForSale();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [itemsForSale]);

  // Дебаунс-функція для введення ціни
  const debouncedSetPrice = debounce((price) => {
    setPriceModal((prev) => ({ ...prev, price }));
    setCommission(price * 0.01);
  }, 300);

  const handlePriceChange = (e) => {
    const price = e.target.value;
    debouncedSetPrice(price);
  };

  const handleOpenPriceModal = (item) => {
    setSelectedItem(item);
    setPriceModal({ isOpen: true, price: '' });
  };

  const handleClosePriceModal = () => {
    setPriceModal({ isOpen: false, price: '' });
    setCommission(0);
  };

  const handleSellItem = () => {
    if (priceModal.price && selectedItem) {
      const itemForSale = {
        ...selectedItem,
        price: priceModal.price,
      };

      axios.post('http://localhost:5001/api/sell-item', {
        itemId: selectedItem.id,
        price: priceModal.price,
      }, { withCredentials: true })
        .then(response => {
          console.log('Предмет успішно виставлено на продаж:', response.data);
          setItemsForSale((prevItems) => [...prevItems, itemForSale]);
          loadInventory(); // Додано для оновлення інвентаря
          handleClosePriceModal();
        })
        .catch(error => {
          console.error('Помилка виставлення на продаж:', error);
          alert('Не вдалося виставити предмет на продаж. Спробуйте ще раз.');
        });
    } else {
      alert('Будь ласка, вкажіть ціну для предмета.');
    }
  };

  const handleRemoveFromSale = (item) => {
    axios.post('http://localhost:5001/api/remove-from-sale', {
      itemId: item.id,
    }, { withCredentials: true })
      .then(response => {
        console.log('Предмет успішно видалено з продажу:', response.data);
        setItemsForSale((prevItems) => prevItems.filter(saleItem => saleItem.id !== item.id));
        setInventory((prevInventory) => [...prevInventory, item]);
      })
      .catch(error => {
        console.error('Помилка видалення з продажу:', error);
        alert('Не вдалося видалити предмет з продажу. Спробуйте ще раз.');
      });
  };

  const handleOpenEditPriceModal = (item) => {
    setEditPriceModal({ isOpen: true, item, price: item.price });
  };

  const handleCloseEditPriceModal = () => {
    setEditPriceModal({ isOpen: false, item: null, price: '' });
  };

  const handleEditPriceChange = (e) => {
    const price = e.target.value;
    setEditPriceModal((prev) => ({ ...prev, price }));
  };

  const handleUpdatePrice = () => {
    if (editPriceModal.price && editPriceModal.item) {
      axios.post('http://localhost:5001/api/update-item-price', {
        itemId: editPriceModal.item.id,
        price: editPriceModal.price,
      }, { withCredentials: true })
        .then(response => {
          console.log('Ціна успішно оновлена:', response.data);
          setItemsForSale((prevItems) => prevItems.map(item =>
            item.id === editPriceModal.item.id ? { ...item, price: editPriceModal.price } : item
          ));
          handleCloseEditPriceModal();
        })
        .catch(error => {
          console.error('Помилка оновлення ціни:', error);
          alert('Не вдалося оновити ціну. Спробуйте ще раз.');
        });
    } else {
      alert('Будь ласка, вкажіть нову ціну для предмета.');
    }
  };

  return (
    <Box className="trade-inventory-page" p="20px">
      <Flex className="inventory-header-container" justifyContent="space-between" alignItems="center" mb="20px">
        <Heading as="h3" size="md" textAlign="left" className="items-for-sale-heading">
          Предмети в продажі
        </Heading>
        <Button onClick={onOpen} colorScheme="teal" className="inventory-button">
          Мій інвентар
        </Button>
      </Flex>

      {error && (
        <Text color="red.500" mb="20px" className="error-message">
          {error}
        </Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered className="inventory-modal">
        <ModalOverlay className="inventory-modal-overlay" />
        <ModalContent className="inventory-modal-content">
          <Flex justifyContent="space-between" alignItems="center" className="inventory-modal-header-container">
            <ModalHeader className="inventory-modal-header">Ваш інвентар</ModalHeader>
            <ModalCloseButton className="inventory-modal-close-button" />
          </Flex>
          <ModalBody className="inventory-modal-body">
            {loading ? (
              <Flex justifyContent="center" className="loading-spinner">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={6} className="inventory-grid">
                {inventory.length > 0 ? (
                  inventory.map((item, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      p="5"
                      bg="gray.700"
                      color="white"
                      className="inventory-item"
                    >
                      <Image src={item.icon_url} alt={item.name} mb="15px" className="inventory-item-image" />
                      <Text fontWeight="bold" textAlign="center" className="inventory-item-name">{item.name}</Text>
                      <Text textAlign="center" className="inventory-item-hero">Герой: {item.hero}</Text>
                      <Text textAlign="center" className="inventory-item-rarity">Раритетність: {item.rarity}</Text>
                      <Button mt="10px" colorScheme="teal" onClick={() => handleOpenPriceModal(item)} className="sell-item-button">
                        Виставити на продаж
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Text color="white" className="no-inventory-message">Інвентар порожній або не завантажено.</Text>
                )}
              </Grid>
            )}
          </ModalBody>
          <ModalFooter className="inventory-modal-footer">
            <Button onClick={loadInventory} className="update-inventory-button">
              Оновити інвентар
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {itemsForSale.length === 0 && (
        <Text className="no-items-for-sale-message">
          Наразі немає предметів у продажі.
        </Text>
      )}

      <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={6} className="items-for-sale-grid">
        {itemsForSale.length > 0 && itemsForSale.map((item, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p="5"
            bg="gray.700"
            color="white"
            className="inventory-item"
          >
            <Image src={item.icon_url} alt={item.name} mb="15px" className="inventory-item-image" />
            <Text fontWeight="bold" textAlign="center" className="inventory-item-name">{item.name}</Text>
            <Text textAlign="center" className="inventory-item-hero">Герой: {item.hero}</Text>
            <Text textAlign="center" className="inventory-item-rarity">Раритетність: {item.rarity}</Text>
            <Text textAlign="center" className="inventory-item-price">Ціна: {item.price} грн</Text>
            <Button mt="10px" colorScheme="red" onClick={() => handleRemoveFromSale(item)} className="remove-from-sale-button">
              Видалити з продажу
            </Button>
            <Button mt="10px" colorScheme="blue" onClick={() => handleOpenEditPriceModal(item)} className="edit-price-button">
              Змінити ціну
            </Button>
          </Box>
        ))}
      </Grid>

      {/* Модальне вікно для встановлення ціни на предмет */}
      <Modal isOpen={priceModal.isOpen} onClose={handleClosePriceModal} size="md" isCentered className="price-modal">
        <ModalOverlay className="price-modal-overlay" />
        <ModalContent className="price-modal-content">
          <ModalHeader className="price-modal-header">Встановити ціну на предмет</ModalHeader>
          <ModalCloseButton className="price-modal-close-button" />
          <ModalBody className="price-modal-body">
            <Text mb="8px" className="price-modal-label">Ціна на предмет:</Text>
            <Input
              placeholder="Вкажіть ціну"
              defaultValue={priceModal.price}
              onChange={handlePriceChange}
              type="number"
              className="price-modal-input"
            />
            <Text mt="10px" className="commission-info">Комісія (1%): {commission.toFixed(2)} грн</Text>
          </ModalBody>
          <ModalFooter className="price-modal-footer">
            <Button colorScheme="blue" mr={3} onClick={handleSellItem} className="sell-item-button">
              Виставити на продаж
            </Button>
            <Button variant="ghost" onClick={handleClosePriceModal} className="cancel-button">Скасувати</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальне вікно для редагування ціни предмета */}
      <Modal isOpen={editPriceModal.isOpen} onClose={handleCloseEditPriceModal} size="md" isCentered className="edit-price-modal">
        <ModalOverlay className="edit-price-modal-overlay" />
        <ModalContent className="edit-price-modal-content">
          <ModalHeader className="edit-price-modal-header">Редагувати ціну на предмет</ModalHeader>
          <ModalCloseButton className="edit-price-modal-close-button" />
          <ModalBody className="edit-price-modal-body">
            <Text mb="8px" className="edit-price-modal-label">Нова ціна на предмет:</Text>
            <Input
              placeholder="Вкажіть нову ціну"
              defaultValue={editPriceModal.price}
              onChange={handleEditPriceChange}
              type="number"
              className="edit-price-modal-input"
            />
          </ModalBody>
          <ModalFooter className="edit-price-modal-footer">
            <Button colorScheme="blue" mr={3} onClick={handleUpdatePrice} className="update-price-button">
              Оновити ціну
            </Button>
            <Button variant="ghost" onClick={handleCloseEditPriceModal} className="cancel-button">Скасувати</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TradeInventoryPage;
