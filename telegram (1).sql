-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Фев 14 2018 г., 10:23
-- Версия сервера: 10.1.28-MariaDB
-- Версия PHP: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `telegram`
--

-- --------------------------------------------------------

--
-- Структура таблицы `coffee`
--

CREATE TABLE `coffee` (
  `id` int(11) NOT NULL,
  `chat_id` int(255) NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `coffee` varchar(255) CHARACTER SET utf8 NOT NULL,
  `coffee_old` varchar(255) CHARACTER SET utf8 NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 NOT NULL,
  `old_price` float NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `place` varchar(255) CHARACTER SET utf8 NOT NULL,
  `time` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `coffee`
--

INSERT INTO `coffee` (`id`, `chat_id`, `user_name`, `coffee`, `coffee_old`, `comment`, `phone`, `old_price`, `price`, `place`, `time`, `status`) VALUES
(27, 269874948, 'undefined', 'Американо 100₽ + Сирип 1$', '', '', '', 0, 100, '', '', 5),
(34, 219702364, 'undefined', ' Цитрусовый раф большой 200₽$ Черный кофе с кардамоном 100₽$ Соевый латте большой 200₽$ Двойной 100₽$Соевый латте большой 200₽$Кемекс 100₽$Клауд ЧСМ маленький 100₽ + Сироп 2$', '', '', '', 0, 61100, '', '', 1),
(35, 219702364, 'undefined', ' Цитрусовый раф большой 200₽$ Черный кофе с кардамоном 100₽$ Соевый латте большой 200₽$ Двойной 100₽$Соевый латте большой 200₽$Кемекс 100₽$Клауд ЧСМ маленький 100₽ + Сироп 2$', '', '', '', 0, 61100, '', '', 1),
(43, 208522847, 'Pogozhev_Alex', 'Пуровер (V60) 159₽ + Ирландский крем 21₽$Маленький латте 99₽ + Кокос 21₽$', '', '', '', 0, 60300, '', '36', 1),
(49, 83856998, 'aplinxy9plin', 'Колдбрю 199₽Эфиопия$Американо 55₽$Колдбрю 199₽Эфиопия$Коколатте 159₽$Лавандовый раф 159₽$Лавандовый раф 159₽$Рафт лемонграсс 199₽$Соевый Коколатте мята 249₽ + Корица для запаха + Холодные сливки 21₽$', '', '', '', 469, 827, '', '20', 4),
(50, 197193967, 'undefined', '', '', '', '', 0, 0, '', '', 0),
(51, 548789421, 'EndorfinCoffee', 'Черный кофе с кардамоном 119₽$$Лавандовый раф 159₽$$', '', '', '', 119, 119, '', '10', 5);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `coffee`
--
ALTER TABLE `coffee`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `coffee`
--
ALTER TABLE `coffee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
