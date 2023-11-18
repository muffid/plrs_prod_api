-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Nov 2023 pada 11.57
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `produksi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `akun`
--

CREATE TABLE `akun` (
  `id_akun` varchar(255) NOT NULL,
  `nama_akun` varchar(255) NOT NULL,
  `username_akun` varchar(255) NOT NULL,
  `password_akun` varchar(255) NOT NULL,
  `status_akun` varchar(255) NOT NULL,
  `foto_akun` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `akun`
--

INSERT INTO `akun` (`id_akun`, `nama_akun`, `username_akun`, `password_akun`, `status_akun`, `foto_akun`) VALUES
('1a', 'lukim', 'lukim', '123', 'Administrator', 'kim.jpg'),
('1b', 'hakim', 'hakim', '123', 'Desainer', 'kim.jpg'),
('1s', 'adi', 'adi', '123', 'Setting', 'hh.jpg'),
('1t', 'dini', 'dini', '123', 'Setting', 'dini.jpd'),
('t3', 'jihan', 'jihan', '123', 'Operator', 'jihan.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `akun_ecom`
--

CREATE TABLE `akun_ecom` (
  `id_akun_ecom` varchar(255) NOT NULL,
  `nama_akun_ecom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `akun_ecom`
--

INSERT INTO `akun_ecom` (`id_akun_ecom`, `nama_akun_ecom`) VALUES
('1e', 'Toko Pedia');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bahan_cetak`
--

CREATE TABLE `bahan_cetak` (
  `id_bahan_cetak` varchar(255) NOT NULL,
  `nama_bahan_cetak` varchar(255) NOT NULL,
  `lebar_bahan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bahan_cetak`
--

INSERT INTO `bahan_cetak` (`id_bahan_cetak`, `nama_bahan_cetak`, `lebar_bahan`) VALUES
('1bh', 'China Papper', '128');

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_order_ecom`
--

CREATE TABLE `data_order_ecom` (
  `id_order_ecom` varchar(255) NOT NULL,
  `id_akun` varchar(255) NOT NULL,
  `order_time` varchar(255) NOT NULL,
  `no_urut` int(255) NOT NULL,
  `no_sc` varchar(225) NOT NULL,
  `id_akun_ecom` varchar(255) NOT NULL,
  `nama_akun_order` varchar(255) NOT NULL,
  `nama_penerima` varchar(255) NOT NULL,
  `nomor_order` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `warna` varchar(255) NOT NULL,
  `id_bahan_cetak` varchar(255) NOT NULL,
  `id_mesin_cetak` varchar(255) NOT NULL,
  `id_laminasi` varchar(255) NOT NULL,
  `lebar_bahan` varchar(255) NOT NULL,
  `panjang_bahan` varchar(255) NOT NULL,
  `qty_order` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `id_ekspedisi` varchar(255) NOT NULL,
  `return_order` varchar(255) NOT NULL,
  `resi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `data_order_ecom`
--

INSERT INTO `data_order_ecom` (`id_order_ecom`, `id_akun`, `order_time`, `no_urut`, `no_sc`, `id_akun_ecom`, `nama_akun_order`, `nama_penerima`, `nomor_order`, `sku`, `warna`, `id_bahan_cetak`, `id_mesin_cetak`, `id_laminasi`, `lebar_bahan`, `panjang_bahan`, `qty_order`, `note`, `key`, `time`, `id_ekspedisi`, `return_order`, `resi`) VALUES
('0jbjP5mdiE', '1b', '2023-11-12 12:00', 2, 'undefined-hak', '1e', 'tol', 'iuu', '34567', '67890', 'cv', '1bh', '1m', '1l', '128', '34', '6', '-', '-', '2023-11-12 21:18', '1e', '-', '3456789'),
('EZa1pJWHIL', '1b', '2023-11-12 12:00', 1, 'undefined-hak', '1e', 'sopy', 'diah', '567890398', '827fhsd', 'kuning', '1bh', '1m', '1l', '128', '126', '2', '-', '-', '2023-11-12 20:58', '1e', 'Y', '2456768776'),
('i5He97dXhf', '1b', '2023-11-12 12:00', 3, 'undefined-hak', '1e', 'dws', 'ss', '121', 'UT7879', 'HGJ', '1bh', '1m', '1l', '128', '7', '8', '-', '-', '2023-11-12 22:18', '1e', '-', '67890'),
('SSuc5QQLeu', '1b', '2023-11-12 11:00', 4, '12-hak', '1e', 'sofialajuba', 'yuhu', 'sarmen', '579', 'putih', '1bh', '1m', '1l', '128', '57', '6', '-', '-', '2023-11-12 22:21', '1e', '-', '3456890');

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_order_non_ecom`
--

CREATE TABLE `data_order_non_ecom` (
  `id_order_ne` varchar(255) NOT NULL,
  `id_akun` varchar(255) NOT NULL,
  `nama_customer` varchar(255) NOT NULL,
  `order_time` varchar(255) NOT NULL,
  `no_urut` varchar(225) NOT NULL,
  `no_sc` varchar(225) NOT NULL,
  `warna` varchar(225) NOT NULL,
  `id_bahan_cetak` varchar(255) NOT NULL,
  `id_mesin_cetak` varchar(255) NOT NULL,
  `id_laminasi` varchar(255) NOT NULL,
  `lebar_bahan` varchar(255) NOT NULL,
  `panjang_bahan` varchar(255) NOT NULL,
  `qty_order` varchar(255) NOT NULL,
  `finishing` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `data_order_non_ecom`
--

INSERT INTO `data_order_non_ecom` (`id_order_ne`, `id_akun`, `nama_customer`, `order_time`, `no_urut`, `no_sc`, `warna`, `id_bahan_cetak`, `id_mesin_cetak`, `id_laminasi`, `lebar_bahan`, `panjang_bahan`, `qty_order`, `finishing`, `note`, `key`, `time`) VALUES
('r4', '1b', 'Hakim', '2023-11-30 04:00', '1', '1-hak', 'Hijau', '1bh', '1m', '1l', '128', '100', '1', 'hilang', 'cepat', '', '2023-10-31 20:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ekspedisi`
--

CREATE TABLE `ekspedisi` (
  `id_ekspedisi` varchar(255) NOT NULL,
  `nama_ekspedisi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ekspedisi`
--

INSERT INTO `ekspedisi` (`id_ekspedisi`, `nama_ekspedisi`) VALUES
('1e', 'JNT');

-- --------------------------------------------------------

--
-- Struktur dari tabel `finish_order`
--

CREATE TABLE `finish_order` (
  `id_finish` varchar(255) NOT NULL,
  `id_akun` varchar(255) NOT NULL,
  `id_order` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `finish_order`
--

INSERT INTO `finish_order` (`id_finish`, `id_akun`, `id_order`, `status`, `time`) VALUES
('7KUBQ3PqRa', '', 'SSuc5QQLeu', 'Belum Cetak', ''),
('BM6uJ0odQu', '', '0jbjP5mdiE', 'Belum Cetak', ''),
('JIpdWFBz4l', '', 'i5He97dXhf', 'Belum Cetak', ''),
('z4x91ud2qk', 't3', 'EZa1pJWHIL', 'Tuntas', '2023-11-12 20:59:49.382');

-- --------------------------------------------------------

--
-- Struktur dari tabel `finish_order_ne`
--

CREATE TABLE `finish_order_ne` (
  `id_finish_ne` varchar(225) NOT NULL,
  `id_akun` varchar(225) NOT NULL,
  `id_order_ne` varchar(225) NOT NULL,
  `status` varchar(225) NOT NULL,
  `time` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `finish_order_ne`
--

INSERT INTO `finish_order_ne` (`id_finish_ne`, `id_akun`, `id_order_ne`, `status`, `time`) VALUES
('jyH8IYimPx', '', 'r4', 'Belum Cetak', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `konsumen_order`
--

CREATE TABLE `konsumen_order` (
  `id_konsumen_order` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `order_time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `laminasi`
--

CREATE TABLE `laminasi` (
  `id_laminasi` varchar(255) NOT NULL,
  `nama_laminasi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `laminasi`
--

INSERT INTO `laminasi` (`id_laminasi`, `nama_laminasi`) VALUES
('1l', 'Bagus');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mesin_cetak`
--

CREATE TABLE `mesin_cetak` (
  `id_mesin_cetak` varchar(255) NOT NULL,
  `nama_mesin_cetak` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mesin_cetak`
--

INSERT INTO `mesin_cetak` (`id_mesin_cetak`, `nama_mesin_cetak`) VALUES
('1m', 'EPSSON');

-- --------------------------------------------------------

--
-- Struktur dari tabel `setting_order`
--

CREATE TABLE `setting_order` (
  `id_setting` varchar(255) NOT NULL,
  `id_akun` varchar(255) NOT NULL,
  `id_order` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `time_start` varchar(255) NOT NULL,
  `time_finish` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `setting_order`
--

INSERT INTO `setting_order` (`id_setting`, `id_akun`, `id_order`, `status`, `time_start`, `time_finish`) VALUES
('DI9YsVWR8h', '1s', '0jbjP5mdiE', 'Proses Setting', '2023-11-12 21:18:51.362', ''),
('p7TZcsAnJ2', '1s', 'EZa1pJWHIL', 'Tuntas', '2023-11-12 20:58:56.383', '2023-11-12 20:59:05.699'),
('UEBdgxFPgM', '', 'SSuc5QQLeu', 'Belum Setting', '', ''),
('UYFnQHbcMh', '1s', 'i5He97dXhf', 'Setting Selesai', '2023-11-12 22:22:34.449', '2023-11-12 22:24:56.820');

-- --------------------------------------------------------

--
-- Struktur dari tabel `setting_order_ne`
--

CREATE TABLE `setting_order_ne` (
  `id_setting_ne` varchar(225) NOT NULL,
  `id_akun` varchar(225) NOT NULL,
  `id_order_ne` varchar(225) NOT NULL,
  `status` varchar(225) NOT NULL,
  `time_start` varchar(225) NOT NULL,
  `time_finish` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `setting_order_ne`
--

INSERT INTO `setting_order_ne` (`id_setting_ne`, `id_akun`, `id_order_ne`, `status`, `time_start`, `time_finish`) VALUES
('jLPSJltn7O', '', 'r4', 'sudah', '', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surat_jalan`
--

CREATE TABLE `surat_jalan` (
  `id_surat_jalan` varchar(255) NOT NULL,
  `id_order` varchar(255) NOT NULL,
  `id_ekspedisi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `akun`
--
ALTER TABLE `akun`
  ADD PRIMARY KEY (`id_akun`);

--
-- Indeks untuk tabel `akun_ecom`
--
ALTER TABLE `akun_ecom`
  ADD PRIMARY KEY (`id_akun_ecom`);

--
-- Indeks untuk tabel `bahan_cetak`
--
ALTER TABLE `bahan_cetak`
  ADD PRIMARY KEY (`id_bahan_cetak`);

--
-- Indeks untuk tabel `data_order_ecom`
--
ALTER TABLE `data_order_ecom`
  ADD PRIMARY KEY (`id_order_ecom`),
  ADD KEY `data_order_ecom_id_akun_foreign` (`id_akun`),
  ADD KEY `data_order_ecom_id_mesin_cetak_foreign` (`id_mesin_cetak`),
  ADD KEY `data_order_ecom_id_bahan_cetak_foreign` (`id_bahan_cetak`),
  ADD KEY `data_order_ecom_id_ekspedisi_foreign` (`id_ekspedisi`),
  ADD KEY `data_order_ecom_id_akun_ecom_foreign` (`id_akun_ecom`),
  ADD KEY `data_order_ecom_id_laminasi_foreign` (`id_laminasi`);

--
-- Indeks untuk tabel `data_order_non_ecom`
--
ALTER TABLE `data_order_non_ecom`
  ADD PRIMARY KEY (`id_order_ne`),
  ADD KEY `data_order_non_ecom_id_meisn_cetak_foreign` (`id_mesin_cetak`),
  ADD KEY `data_order_non_ecom_id_akun_foreign` (`id_akun`),
  ADD KEY `data_order_non_ecom_id_bahan_cetak_foreign` (`id_bahan_cetak`),
  ADD KEY `data_order_non_ecom_id_laminasi_foreign` (`id_laminasi`);

--
-- Indeks untuk tabel `ekspedisi`
--
ALTER TABLE `ekspedisi`
  ADD PRIMARY KEY (`id_ekspedisi`);

--
-- Indeks untuk tabel `finish_order`
--
ALTER TABLE `finish_order`
  ADD PRIMARY KEY (`id_finish`),
  ADD KEY `finish_order_id_akun_foreign` (`id_akun`);

--
-- Indeks untuk tabel `finish_order_ne`
--
ALTER TABLE `finish_order_ne`
  ADD PRIMARY KEY (`id_finish_ne`);

--
-- Indeks untuk tabel `konsumen_order`
--
ALTER TABLE `konsumen_order`
  ADD PRIMARY KEY (`id_konsumen_order`);

--
-- Indeks untuk tabel `laminasi`
--
ALTER TABLE `laminasi`
  ADD PRIMARY KEY (`id_laminasi`);

--
-- Indeks untuk tabel `mesin_cetak`
--
ALTER TABLE `mesin_cetak`
  ADD PRIMARY KEY (`id_mesin_cetak`);

--
-- Indeks untuk tabel `setting_order`
--
ALTER TABLE `setting_order`
  ADD PRIMARY KEY (`id_setting`),
  ADD KEY `setting_order_id_akun_foreign` (`id_akun`);

--
-- Indeks untuk tabel `setting_order_ne`
--
ALTER TABLE `setting_order_ne`
  ADD PRIMARY KEY (`id_setting_ne`);

--
-- Indeks untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD PRIMARY KEY (`id_surat_jalan`),
  ADD KEY `surat_jalan_id_ekspedisi_foreign` (`id_ekspedisi`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `data_order_ecom`
--
ALTER TABLE `data_order_ecom`
  ADD CONSTRAINT `data_order_ecom_id_akun_ecom_foreign` FOREIGN KEY (`id_akun_ecom`) REFERENCES `akun_ecom` (`id_akun_ecom`),
  ADD CONSTRAINT `data_order_ecom_id_akun_foreign` FOREIGN KEY (`id_akun`) REFERENCES `akun` (`id_akun`),
  ADD CONSTRAINT `data_order_ecom_id_bahan_cetak_foreign` FOREIGN KEY (`id_bahan_cetak`) REFERENCES `bahan_cetak` (`id_bahan_cetak`),
  ADD CONSTRAINT `data_order_ecom_id_ekspedisi_foreign` FOREIGN KEY (`id_ekspedisi`) REFERENCES `ekspedisi` (`id_ekspedisi`),
  ADD CONSTRAINT `data_order_ecom_id_laminasi_foreign` FOREIGN KEY (`id_laminasi`) REFERENCES `laminasi` (`id_laminasi`),
  ADD CONSTRAINT `data_order_ecom_id_mesin_cetak_foreign` FOREIGN KEY (`id_mesin_cetak`) REFERENCES `mesin_cetak` (`id_mesin_cetak`);

--
-- Ketidakleluasaan untuk tabel `data_order_non_ecom`
--
ALTER TABLE `data_order_non_ecom`
  ADD CONSTRAINT `data_order_non_ecom_id_akun_foreign` FOREIGN KEY (`id_akun`) REFERENCES `akun` (`id_akun`),
  ADD CONSTRAINT `data_order_non_ecom_id_bahan_cetak_foreign` FOREIGN KEY (`id_bahan_cetak`) REFERENCES `bahan_cetak` (`id_bahan_cetak`),
  ADD CONSTRAINT `data_order_non_ecom_id_laminasi_foreign` FOREIGN KEY (`id_laminasi`) REFERENCES `laminasi` (`id_laminasi`),
  ADD CONSTRAINT `data_order_non_ecom_id_meisn_cetak_foreign` FOREIGN KEY (`id_mesin_cetak`) REFERENCES `mesin_cetak` (`id_mesin_cetak`);

--
-- Ketidakleluasaan untuk tabel `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD CONSTRAINT `surat_jalan_id_ekspedisi_foreign` FOREIGN KEY (`id_ekspedisi`) REFERENCES `ekspedisi` (`id_ekspedisi`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
