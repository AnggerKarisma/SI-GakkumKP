<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; }
        .container { width: 100%; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 25px; }
        .header h1 { margin: 0; }
        .header p { margin: 0; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px;}
        th, td { border: 1px solid #777; text-align: left; padding: 6px; }
        th { background-color: #f2f2f2; }
        .summary-table th { text-align: right; width: 40%;}
        .summary-table td { text-align: left; }
        .text-center { text-align: center; }
        .footer { text-align: center; font-size: 9px; color: #777; position: fixed; bottom: 0; width: 100%; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $title }}</h1>
            <p>Periode: {{ \Carbon\Carbon::parse($summary['period']['start_date'])->format('d M Y') }} - {{ \Carbon\Carbon::parse($summary['period']['end_date'])->format('d M Y') }}</p>
            <p>Tanggal Cetak: {{ $date }}</p>
        </div>

        <h3>Ringkasan Laporan</h3>
        <table class="summary-table">
            <tr>
                <th>Total Peminjaman</th>
                <td>{{ $summary['total_peminjaman'] }}</td>
            </tr>
            <tr>
                <th>Peminjaman Aktif</th>
                <td>{{ $summary['peminjaman_aktif'] }}</td>
            </tr>
            <tr>
                <th>Peminjaman Jatuh Tempo (Overdue)</th>
                <td>{{ $summary['peminjaman_overdue'] }}</td>
            </tr>
            <tr>
                <th>Peminjaman Selesai</th>
                <td>{{ $summary['peminjaman_selesai'] }}</td>
            </tr>
            <tr>
                <th>Pengembalian Terlambat</th>
                <td>{{ $summary['pengembalian_terlambat'] }}</td>
            </tr>
        </table>
        
        <h3>Detail Peminjaman</h3>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Peminjam</th>
                    <th>Kendaraan</th>
                    <th>Tgl Pinjam</th>
                    <th>Jatuh Tempo</th>
                    <th>Tgl Kembali</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($details as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>{{ $item->user->nama ?? 'N/A' }}</td>
                        <td>{{ $item->kendaraan->jenis ?? 'N/A' }} ({{ $item->kendaraan->platNo ?? 'N/A' }})</td>
                        <td>{{ \Carbon\Carbon::parse($item->tglPinjam)->format('d/m/Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($item->tglJatuhTempo)->format('d/m/Y') }}</td>
                        <td>{{ $item->tglKembaliAktual ? \Carbon\Carbon::parse($item->tglKembaliAktual)->format('d/m/Y') : '-' }}</td>
                        <td>
                            @if ($item->status_info['is_returned'])
                                Selesai
                                @if ($item->status_info['is_late_return'])
                                    (Terlambat {{ $item->status_info['late_return_days'] }} hr)
                                @endif
                            @elseif ($item->status_info['is_overdue'])
                                Jatuh Tempo ({{ $item->status_info['overdue_days'] }} hr)
                            @else
                                Aktif
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center">Tidak ada data untuk periode ini.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="footer">
        Dicetak oleh sistem pada {{ date('d-m-Y H:i:s') }}
    </div>
</body>
</html>