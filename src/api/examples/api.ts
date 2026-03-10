import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "../common";
import {
  TDetailFacilitiesResponse,
  TListFacilitiesResponse,
  TFacilities,
  TFacilitiesFilter,
  TFacilitiesRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  list: "/master-data/facilities",
  detail: "/master-data/facilities/:id",
  create: "/master-data/facilities/create",
  edit: "/master-data/facilities/:id/update",
};

const mock: TFacilities[] = [
  {
    id: "1",
    name: "Taman Bermain Anak",
    type: {
      id: "A",
      name: "Rekreasi",
    },
  },
  {
    id: "2",
    name: "Kolam Renang Umum",
    type: {
      id: "B",
      name: "Olahraga",
    },
  },
  {
    id: "3",
    name: "Pos Keamanan 24 Jam",
    type: {
      id: "C",
      name: "Keamanan",
    },
  },
  {
    id: "4",
    name: "Ruang Serbaguna",
    type: {
      id: "D",
      name: "Fasilitas Sosial",
    },
  },
  {
    id: "5",
    name: "Jalur Jogging",
    type: {
      id: "B",
      name: "Olahraga",
    },
  },
];

export const getListFacilities = async (
  params?: TFacilitiesFilter,
): Promise<TListFacilitiesResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: {
      data: mock,
      currentPage: 1,
      total: 10,
      totalPage: 4,
      hasPreviousPage: false,
      hasNextPage: true,
    },
  });

  const res = await api.get(endpoints.list, { params });

  return res.data;
};

export const getDetailFacilities = async (
  params?: TDetailParams,
): Promise<TDetailFacilitiesResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: mock.find((item) => item.id === params?.id) || null,
  });

  const res = await api.get(generatePath(endpoints.detail, { params }));
  return res.data;
};

export const createFacilities = async (req: TFacilitiesRequest): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });
  const res = await api.post(endpoints.create, { data: req });
  return res.data;
};

export const editFacilities = async (
  params: TDetailParams,
  req: TFacilitiesRequest,
): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });

  const res = await api.put(generatePath(endpoints.edit, { id: params.id }), { data: req });
  return res.data;
};
