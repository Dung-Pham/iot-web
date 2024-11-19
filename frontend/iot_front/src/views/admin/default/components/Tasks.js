import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";

// Assets
import { MdDragIndicator } from "react-icons/md";
import { useState } from 'react';

export default function Conversion(props) {
  const { ...rest } = props;

  const [isAutoMode, setAutoMode] = useState(true);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorDisabled = useColorModeValue("secondaryGray.100", "secondaryGray.900");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");

  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex alignItems='center' w='100%' mb='30px'>
        <Text color={textColor} fontSize='lg' fontWeight='700'>
          Bảng điều khiển
        </Text>
      </Flex>
      <Box px='11px'>
        <Flex mb='20px'>
          <Checkbox
            me='16px'
            isChecked={isAutoMode}
            onChange={() => setAutoMode(prevState => !prevState)}
            colorScheme='brandScheme'
          />
          <Text
            fontWeight='bold'
            color={textColor}
            fontSize='md'
            textAlign='start'>
            Bật chế độ tự động
          </Text>
          <Icon
            ms='auto'
            as={MdDragIndicator}
            color='secondaryGray.600'
            w='24px'
            h='24px'
          />
        </Flex>
      </Box>

      <Box px='11px'>
        <Flex mb='20px'>
          {/* Second checkbox */}
          <Checkbox
            me='16px'
            isDisabled={isAutoMode}
            colorScheme='brandScheme'
          />
          <Text
            fontWeight='bold'
            color={isAutoMode ? textColorDisabled : textColor}
            fontSize='md'
            textAlign='start'>
            Bật đèn
          </Text>
          <Icon
            ms='auto'
            as={MdDragIndicator}
            color='secondaryGray.600'
            w='24px'
            h='24px'
          />
        </Flex>
      </Box>

      <Box px='11px'>
        <Flex mb='20px'>
          {/* Third checkbox */}
          <Checkbox
            me='16px'
            isDisabled={isAutoMode}
            colorScheme='brandScheme'
          />
          <Text
            fontWeight='bold'
            color={isAutoMode ? textColorDisabled : textColor}
            fontSize='md'
            textAlign='start'>
            Bật mái che
          </Text>
          <Icon
            ms='auto'
            as={MdDragIndicator}
            color='secondaryGray.600'
            w='24px'
            h='24px'
          />
        </Flex>
      </Box>
    </Card>
  );
}
