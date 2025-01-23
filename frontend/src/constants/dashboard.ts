import { icons} from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon, TimerIcon } from "@radix-ui/react-icons";

export type User = {
  id: string;
  fileName: string;
  description: string;
  owner: string;
  status: "verified" | "pending" | "rejected";
  document_hash: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const Stats = [
  {
    status: "Pending",
    count: 12,
    variant: "yellow",
  },
  {
    status: "Verified",
    count: 45,
    variant: "green",
  },
  {
    status: "Rejected",
    count: 3,
    variant: "red",
  }
];

export const users: User[] = [
  {
    id: "9953ed85-31a0-4db9-acc8-e25b76176443",
    fileName: "Akta Kelahiran.pdf",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac",
    owner: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    status: "pending",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "328c2bef-d84b-44a2-b5ae-03bd6550c4c4",
    fileName: "Sertifikat tanah.docs",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e9373f88E0e188F862A99F65944d8a0CB603",
    status: "rejected",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "9543e3a4-99f2-4fcb-ba5d-f2aaebff6716",
    fileName: "Akta Kelahiran.pdf",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e9373f88E0e188F862A99F6594qwewqreq12412",
    status: "verified",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "bdcba306-57fa-4722-82e3-c4933b09e69b",
    fileName: "Ijazah.png",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e9373f88E13rF862A99F65944d8a0CB603",
    status: "pending",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "e643dbea-0ab2-4d3d-8bb8-63aedf027a66",
    fileName: "sertifikat emas.docx",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e91241DDE0e188F862A99F65944d8a0CB603",
    status: "verified",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "94093200-c89f-410f-ba96-046f33fabb3e",
    fileName: "Surat BAP.pdf",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e9373fEo9988F862A99F65944d8a0CB603",
    status: "rejected",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-07T23:35:52.087Z"),
    updatedAt: new Date("2024-02-07T23:38:03.259Z"),
  },
  {
    id: "4174f655-5cb2-4bd9-a785-ce11f16cebb0",
    fileName: "Surat Resign.pdf",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e93733338E0e188F862A99F65944d8a0CB603",
    status: "pending",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-13T15:35:02.010Z"),
    updatedAt: new Date("2024-02-13T15:37:03.020Z"),
  },
  {
    id: "38d5126b-4473-40d2-8142-2e7049c07346",
    fileName: "surat nikah.docs",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e9373f232322e188F862A99F65944d8a0CB603",
    status: "rejected",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-14T16:39:04.030Z"),
    updatedAt: new Date("2024-02-14T16:40:05.040Z"),
  },
  {
    id: "cb3ae8be-e376-4d26-9cfc-5884348c22ec",
    fileName: "akta cerai.pdf",
    description: "Rolem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e937312e13410e188F862A99F65944d8a0CB603",
    status: "verified",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-15T17:41:06.050Z"),
    updatedAt: new Date("2024-02-15T17:42:07.060Z"),
  },
  {
    id: "fa47c0f4-620c-40b3-a16a-b9afa9a88215",
    fileName: "kontrak kerja.pdf",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac",
    owner: "0xd248e937143423E0e188F862A99F65944d8a0CB603",
    status: "pending",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-16T18:43:08.070Z"),
    updatedAt: new Date("2024-02-16T18:44:09.080Z"),
  },
  {
    id: "8ce5b4d9-5182-4cbf-9d48-f187b377e931",
    fileName: "Surat Kepemilikan.pdf",
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e91241388E0e188F862A99F65944d8a0CB603",
    status: "verified",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-17T19:45:10.090Z"),
    updatedAt: new Date("2024-02-17T19:46:11.100Z"),
  },
  {
    id: "cb2c15c3-7fc9-4d51-8b7b-3e636ac6195b",
    fileName: "Surat Keterampilan.pdf",
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Sed Ac",
    owner: "0xd248e912321f88E0e188F862A99F65944d8a0CB603",
    status: "rejected",
    document_hash: "0xE65E154189542BDB74c3928Ecd913Ae437a76C52",
    createdAt: new Date("2024-02-18T20:47:12.110Z"),
    updatedAt: new Date("2024-02-18T20:48:13.120Z"),
  },
];

export const usersStatus = [
  {
    value: "rejected",
    label: "Rejected",
    icon: CrossCircledIcon,
  },
  {
    value: "verified",
    label: "Verified",
    icon: CheckCircledIcon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: TimerIcon,
  },
];
export const usersRole = [
  {
    value: "client",
    label: "Client",
  },
  {
    value: "provider",
    label: "Provider",
  },
];