create or replace database LPPTD

use LPPTD

create or replace table user(
	userID Int primary key not null Auto_increment,
	nama varchar(255)not null unique,
	NIP varchar(255) not null unique,
	password varchar(255)not null,
	jabatan varchar (255)not null,
	unitKerja enum ("Balai","Sekwil I / Palangka raya", "Sekwil II / Samarinda", "Sekwil III / Pontianak")not null,
	role enum("Super Admin", "Admin", "User")not null default "User"
);

create or replace table kendaraan(
	kendaraanID int primary key not null Auto_increment,
	namaKendaraan varchar(255) not null,
	plat varchar(255) not null unique,
	pemilik varchar(255) not null,
	alamat varchar(255) not null,
	merk varchar(255) not null,
	model varchar(255) not null,
	jenisKendaraan enum ('mobil','motor'),
	tahunPembuatan date,
	silinder varchar(255) not null,
	warnaKB varchar (255) not null,
	noRangka varchar (255) not null,
	noMesin varchar (255) not null,
	noBPKB varchar (255) not null,
	warnaTNKB varchar (255) not null,
	bahanBakar enum ("Bensin", "Solar"),
	tahunRegistrasi int,
	berlakuSampai date,
	biaya varchar(255),
	penanggungjawab varchar(255) not null,
	NUP varchar(255) not null,
	unitKerja enum ("Balai","Sekwil I / Palangka raya", "Sekwil II / Samarinda", "Sekwil III / Pontianak")not null,
	gambar_url varchar(255),
	statKendaraan enum ("Stand by","Not Available","Maintenance")not null default "Stand by",
	Kkendaraan varchar(255)not null
);

create or replace table pinjam(
	pinjamID int primary key not null Auto_increment,
	userID int not null,
	foreign key (userID) references user (userID),
	kendaraanID int not null,
	foreign key (kendaraanID) references kendaraan (kendaraanID),
	tglPinjam date,
	tglKembali date
);

create or replace table pajak(
	pajakID int primary key not null Auto_increment,
	kendaraanID int not null unique,
	foreign key (kendaraanID) references kendaraan (kendaraanID),
	nostnk varchar(255) not null,
	activeSTNK date,
	activePT date
);


show tables;
drop database LPPTD

insert into user (nama,NIP ,email,password ,jabatan,unitKerja,role)
values ("SuperAdmin1","000000001","superdminsatu@gmail.com","12345678","Kepala Balai", "Balai", "Super Admin");

insert into user (nama,NIP ,email,password ,jabatan,unitKerja,role)
values ("SuperAdmin2","000000002","superdmindua@gmail.com","12345678","Staff Balai", "Balai", "Super Admin");

insert into user (nama,NIP ,email,password ,jabatan,unitKerja,role)
values ("SuperAdmin3","000000003","superdmintiga@gmail.com","12345678","Staff Balai", "Balai", "Super Admin");

select * from `user` ;
#Procedure account

create or replace procedure regist(
	in _nama varchar(255),
	in _NIP varchar(255),
	in _email varchar(255),
	in _password varchar(255),
	in _jabatan varchar(255),
	in _unitKerja enum ("Balai","Sekwil I / Palangka raya", "Sekwil II / Samarinda", "Sekwil III / Pontianak")
) begin 
	
	declare exit handler for sqlexception
	begin
		rollback;
		resignal;
	end;
	start transaction;
	if _nama is null or _NIP is null or _email is null or _password is null or _jabatan is null or _unitKerja is null then
		signal sqlstate '45000' set message_text = "Semua kolom harus diisi.";
	end if;

	insert into `user` ( nama, NIP ,email, password, jabatan, unitKerja, role )
	values(_nama,_NIP,_email,sha2(_password,256),_jabatan, _unitKerja, 'user');
	commit;
end

create or replace procedure buat_akun_byADmin(
	in _idUSer int,
	in _nama varchar(255),
	in _NIP varchar(255),
	in _email varchar(255),
	in _password varchar(255),
	in _jabatan varchar(255),
	in _unitKerja enum("Balai","Sekwil I / Palangka raya", "Sekwil II / Samarinda", "Sekwil III / Pontianak"),
	in _NewRole enum ("Admin","User")
)
begin 
	declare _roleUser varchar(255);
	declare _unitKerja_User varchar(255);
	select role, unitKerja into _roleUser, _unitKerja_User from `user` u where userID = _idUser;
	
	if _roleUser ="Admin" and _NewRole ="Admin" then 
		signal sqlstate '45000' set message_text = "Akses ditolak: Admin tidak dapat membuat akun Admin lain.";
	end if;
	
	if _roleUser = "Admin" and _unitKerja_User <> _unitKerja then 
		signal sqlstate '45000' set message_text = "Akses ditolak: Admin hanya dapat membuat user di unit kerjanya.";
	end if;

	if _roleUser in ('Super Admin', 'Admin') then
		insert into `user` (nama,NIP,email,password,jabatan,unitKerja,role)
		values (_nama, _NIP,_email, sha2(_password, 256), _jabatan, _unitKerja,_NewRole);
	else
		signal sqlstate '45000' set message_text = "Akses ditolak: Hanya Admin atau Super Admin yang dapat membuat Akun.";
	end if;
end

create or replace procedure loginUser(
	in _NIP varchar(255),
	in _password varchar(255)
)begin 
	if(length(coalesce(_NIP,'')) <1 ) then 
		signal sqlstate '45000' set message_text = "NIP tidak boleh kosong.";
	end if;
	if(length(_password)< 6 ) then
		signal sqlstate '45000' set message_text = "panjang password minimal 6 karakter";
	end if;
	select userID, nama, NIP , email, jabatan, unitKerja,`role` from `user` u 
	where u.NIP = _NIP and u.password = sha2(_password, 256);
end

create or replace procedure update_profil(
	in _userID_user int,
	in _newEmail varchar(255),
	in _newPass varchar (255)
)
begin 
	if _newPass is not null and length(_newPass) >0 then 
		update `user` set email = _newEmail, password = sha2(_newPass,256) where userID = _userID_user;
	else
		update `user` set email =_newEmail where userID = _userID_user;
	end if;
end

create or replace procedure kelola_akun(
	in _id_user int,
	in _id_target int,
	in _aksi enum ('update', 'delete'),
	in _NewJabatan varchar(255),
	in _NewUnitKerja enum("Balai","Sekwil I / Palangka Raya", "Sekwil II / Samarinda","Sekwil III / Pontianak"),
	in _newRole enum ("Admin", "User")
)
begin
	declare _role_user varchar(255);
	declare _role_target varchar(255);
	select role into _role_user from `user` u where userID = _id_user;
	select role into _role_target from `user` u where userID = _id_target;
	
	if _id_user = _id_target then 
		signal sqlstate '45000' set message_text = "tidak dapat mengelola akun sendiri.";
	end if;
	if _role_user = 'Admin' and _role_target in ('Admin', 'Super Admin')then 
		signal sqlstate '45000' set message_text = "Akses Ditolak.";
	end if;
	if _aksi = "update" then
		update `user` set jabatan = _NewJabatan, unitKerja = _NewUnitKerja, role = _newRole where userID = _id_target;
	elseif _aksi = 'delete' then
		delete from `user` where userID = _id_target;
	end if;
end


create or replace procedure showAcc()
begin
	select `user`.nama, `user`.email, `user`.unitKerja  from `user`;
end;

call showAcc;

#Procedure feature

create or replace procedure showVeh(
	in _userID_user int
)
begin
	declare _role_user varchar(255);
	declare _unitkerja_user varchar(255);
	select role , unitKerja into _role_user, _unitKerja_user from `user` 
	where userID = _userID_user;
	
	if _role_user = 'Super Admin' or _unitKerja_user = 'Balai' then 
		select * from kendaraan k ;
	else 
		select * from kendaraan k where unitKerja =_unitKerja_user;
	end if;
end;

create or replace procedure tambahKendaraan(
	in _user_Id int,
	in _namaKendaraan varchar(255),
	in _plat varchar(255),
	in _pemilik varchar(255),
	in _alamat varchar (255),
	in _merk varchar (255),
	in _model varchar(255),
	in _jenisKendaraan enum ("mobil","motor"),
	in _tahunPembuatan int,
	in _silinder varchar(255),
	in _warnaKB varchar(255),
	in _noRangka varchar(255),
	in _noMesin varchar(255),
	in _noBPKB varchar(255),
	in _warnaTNKB varchar(255),
	in _bahanBakar enum ("Bensin", "Solar"),
	in _tahunRegistrasi int,
	in _berlakuSampai date,
	in _biaya varchar(255),
	in _penanggungJawab varchar(255),
	in _NUP varchar(255),
	in _unitKerja_kendaraan enum ("Balai","Sekwil I / Palangka Raya", "Sekwil II / Samarinda","Sekwil III / Pontianak"),
	in _gambar_url varchar(255),
	in _Kkendaraan varchar(255)
) begin 
	declare _roleUser varchar(255);
	declare _unitKerja_user varchar(255);
	select role, unitKerja into _roleUser, _unitKerja_user from `user` u where userID = _user_id;
	
	if _roleUser in ('Admin', 'Super Admin')then
		if _roleUser = 'Admin' and _unitKerja_user <> _unitKerja_kendaraan then 
			signal sqlstate '45000' set message_text = "Admin hanya dapat menambah kendaraan di unit kerjanya sendiri.";
		end if;
		insert into kendaraan (namaKendaraan,plat,pemilik,alamat,merk,model,jenisKendaraan,tahunPembuatan,silinder,warnaKB,noRangka,noMesin,noBPKB,warnaTNKB,bahanBakar,tahunRegistrasi,berlakuSampai,biaya,penanggungjawab,NUP,unitKerja,gambar_url,Kkendaraan,statKendaraan)
		values (_namaKendaraan, _plat, _pemilik, _alamat, _merk, _model, _jenisKendaraan, _tahunPembuatan, _silinder, _warnaKB, _noRangka, _noMesin, _noBPKB, _warnaTNKB, _bahanBakar, _tahunRegistrasi, _berlakuSampai, _biaya, _penanggungjawab, _NUP, _unitKerja_kendaraan, _gambar_url, _Kkendaraan, 'Stand by');
	else
		signal sqlstate '45000' set message_text = "Akses Ditolak.";
	end if;
end


create or replace procedure pinjam(
	in _userID int,
	in _kendaraanID int,
	in _tglPinjam date
)begin 
	declare exit handler for sqlexception
	begin
		rollback;
		resignal;
	end;
	if (select statKendaraan from kendaraan k where kendaraanID = _kendaraanID) <> 'Stand by' then 
		signal sqlstate '45000' set message_text = 'kendaraan tidak tersedia untuk dipinjam.';
	end if;
	start transaction;
	insert into pinjam ( userID, kendaraanID,tglPinjam)
	values(_userID, _kendaraanID,_tglPinjam);
	commit;
end

create or replace trigger update_statusKendaraan
after insert on pinjam
for each row 
begin
	update kendaraan set statKendaraan = "Not Available"
	where kendaraan.kendaraanID = new.kendaraanID;
end

create or replace procedure kembali(
	in _pinjamID int,
	in _tglKembali date
)
begin 

	update pinjam set tglKembali = _tglKembali 
	where pinjamID =_pinjamID;
	
	if row_count() = 0 then
		signal sqlstate '45000' set message_text = "ID Pinjam tidak ditemukan.";
	else
		select 'Pengembalian Berhasil.' as message;
	end if;
end

create or replace trigger default_StatusKendaraan
after update on pinjam
for each row
begin
	if new.tglKembali is not null and old.tglKembali is null then
		update kendaraan set statKendaraan = "Stand by"
		where kendaraan.kendaraanID = old.kendaraanID;
	end if;
end

create or replace procedure kendaraanRusak(
	in _kendaraanID int,
	in _status_baru enum ('Maintenance','Stand by')
)begin 
	declare _statNow varchar(255);
	declare exit handler for sqlexception
	begin
		rollback;
		resignal;
	end;
	start transaction;
	
	if not exists (select 1 from kendaraan k where kendaraanID = _kendaraanID) then 
		signal sqlstate '45000' set message_text = 'Kendaraan dengan tidak ditemukan.';
	end if;
	select statKendaraan into _statNow from kendaraan k 
	where kendaraanID = _kendaraanID;
	
	if _status_baru = 'Maintenance' and _statNow = 'Not Available' then
		signal sqlstate '45000' set message_text = 'Kendaraan dalam status Dipinjam, Tidak dapat melakukan Maintenance.';
	end if;
	
	update kendaraan set statKendaraan = _status_baru 
	where kendaraanID = _kendaraanID;
	
	commit;
end

create or replace procedure update_data_kendaraan(
	in _user_Id int,
	in _namaKendaraan varchar(255),
	in _plat varchar(255),
	in _pemilik varchar(255),
	in _alamat varchar (255),
	in _merk varchar (255),
	in _model varchar(255),
	in _jenisKendaraan enum ("mobil","motor"),
	in _tahunPembuatan int,
	in _silinder varchar(255),
	in _warnaKB varchar(255),
	in _noRangka varchar(255),
	in _noMesin varchar(255),
	in _noBPKB varchar(255),
	in _warnaTNKB varchar(255),
	in _bahanBakar enum ("Bensin", "Solar"),
	in _tahunRegistrasi int,
	in _berlakuSampai date,
	in _biaya varchar(255),
	in _penanggungJawab varchar(255),
	in _NUP varchar(255),
	in _unitKerja_kendaraan enum ("Balai","Sekwil I / Palangka Raya", "Sekwil II / Samarinda","Sekwil III / Pontianak"),
	in _gambar_url varchar(255),
	in _Kkendaraan varchar(255)
) begin 
	declare _role_user varchar(255);
    declare _unitKerja_user varchar(255);
    select role, unitKerja into _role_user, _unitKerja_user from user where userID = _id_user;

    if _role_user in ('Admin', 'Super Admin') then
        if _role_user = 'Admin' and _unitKerja_user <> (select unitKerja from kendaraan where kendaraanID = _kendaraanID) then 
             signal sqlstate '45000' set message_text = "Admin hanya dapat mengubah kendaraan di unit kerjanya sendiri.";
        end if;

        update kendaraan set 
            namaKendaraan = _namaKendaraan,
            plat = _plat, 
            pemilik = _pemilik, 
            alamat = _alamat, 
            merk = _merk, 
            model = _model,
            jenisKendaraan = _jenisKendaraan, 
            tahunPembuatan = _tahunPembuatan, 
            silinder = _silinder, 
            warnaKB = _warnaKB,
            noRangka = _noRangka, 
            noMesin = _noMesin, 
            noBPKB = _noBPKB, 
            warnaTNKB = _warnaTNKB, 
            bahanBakar = _bahanBakar,
            tahunRegistrasi = _tahunRegistrasi, 
            berlakuSampai = _berlakuSampai, 
            biaya = _biaya, 
            penanggungjawab = _penanggungjawab,
            NUP = _NUP, 
            unitKerja = _unitKerja_kendaraan, 
            gambar_url = _gambar_url, 
            Kkendaraan = _Kkendaraan, 
            statKendaraan = _statKendaraan
        where 
       		kendaraanID = _kendaraanID;
    else
        signal sqlstate '45000' set message_text = "Akses ditolak.";
    end if;
end

create or replace procedure kelolaPajak (
	in _kendaraanID int,
	in _nostnk varchar(255),
	in _activeSTNK date,
	in _activePT date 
)
begin 
	if not exists (select 1 from kendaraan where kendaraanID =_kendaraanID)then
		signal sqlstate '45000' set message_text = 'Kendaraan tidak ditemukan.';
	end if;
	insert into pajak (kendaraanID, nostnk, activeSTNK, activePT)
	values (_kendaraanID, _nostnk, _activeSTNK, _activePT)
	on duplicate key update 
		nostnk = values(nostnk),
		activeSTNK = values(activeSTNK),
		activePT = values (activePT);
end

create or replace procedure laporanPinjam(
	in _id_user int,
	in _tglMulai date,
	in _tglSelesai date
)
begin 
	declare _role_user varchar(255);
	declare _unitKerja_user varchar(255);
	select 
		role , unitKerja into _role_user, _unitKerja_user from `user` u 
		where userID = _id_user;
	if _role_user = 'Super Admin' or _unitKerja_user = 'Balai' then 
		select 
			pinjam.pinjamID,
			pinjam.tglPinjam,
			pinjam.tglKembali,
			user.nama as peminjam,
			user.unitKerja as unit_Kerja_peminjam,
			kendaraan.namaKendaraan,
			kendaraan.plat,
			kendaraan.unitKerja as unit_Kerja_kendaraan
		from pinjam p 
		join `user` u on pinjam.userID = user.userID
		join kendaraan k on pinjam.kendaraanID = kendaraan.kendaraanID 
		where 
			pinjam.tglPinjam between _tglMulai and _tglSelesai
		order by 
			pinjam.tglPinjam desc;
	else
		select 
			pinjam.pinjamID,
			pinjam.tglPinjam,
			pinjam.tglKembali,
			user.nama as peminjam,
			kendaraan.namaKendaraan,
			kendaraan.plat
		from pinjam p 
		join `user` u on pinjam.userID = user.userID
		join kendaraan k on pinjam.kendaraanID  = kendaraan.kendaraanID
		where 
			kendaraan.unitKerja = _unitKerja_User and pinjam.tglPinjam between _tglMulai and _tglSelesai
		order by
			pinjam.tglPinjam desc;
	end if;
end