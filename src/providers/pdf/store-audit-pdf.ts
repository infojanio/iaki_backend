import PDFDocument = require("pdfkit");

import { PassThrough } from "node:stream";

import { StoreAuditReport } from "@/use-cases/reports/generate-store-audit-report";

const MARGIN = 40;

const CONTENT_WIDTH = 515;

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: Date | null) {
  if (!value) {
    return "-";
  }

  return value.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",

    day: "2-digit",
    month: "2-digit",
    year: "numeric",

    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(value?: string | null) {
  if (!value) {
    return "-";
  }

  return value.replace(/-/g, "").slice(0, 8).toUpperCase();
}

function ensureSpace(doc: PDFKit.PDFDocument, required = 40) {
  const limit = doc.page.height - 55;

  if (doc.y + required > limit) {
    doc.addPage();
  }
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 40);

  doc
    .moveDown(0.7)
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#4C1D95")
    .text(title);

  doc
    .moveDown(0.25)
    .strokeColor("#DDD6FE")
    .lineWidth(1)
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + CONTENT_WIDTH, doc.y)
    .stroke();

  doc.moveDown(0.5);
}

function keyValue(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | number,
) {
  ensureSpace(doc, 20);

  const y = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#374151")
    .text(label, MARGIN, y, {
      width: 150,
    });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#111827")
    .text(String(value), MARGIN + 155, y, {
      width: CONTENT_WIDTH - 155,
    });

  doc.y = Math.max(doc.y, y + 16);
}

interface TableColumn<T> {
  title: string;

  width: number;

  getValue: (row: T) => string;
}

function drawTable<T>(
  doc: PDFKit.PDFDocument,
  columns: TableColumn<T>[],
  rows: T[],
) {
  const totalWidth = columns.reduce((total, column) => total + column.width, 0);

  function header() {
    ensureSpace(doc, 30);

    const y = doc.y;

    doc.rect(MARGIN, y, totalWidth, 22).fill("#F3F4F6");

    let x = MARGIN;

    columns.forEach((column) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#374151")
        .text(column.title, x + 4, y + 7, {
          width: column.width - 8,

          ellipsis: true,
        });

      x += column.width;
    });

    doc.y = y + 24;
  }

  header();

  if (rows.length === 0) {
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#6B7280")
      .text("Nenhum registro encontrado.");

    return;
  }

  rows.forEach((row, index) => {
    doc.font("Helvetica");

    doc.fontSize(7);

    let rowHeight = 22;

    columns.forEach((column) => {
      const text = column.getValue(row);

      const textHeight = doc.heightOfString(text, {
        width: column.width - 8,
      });

      rowHeight = Math.max(rowHeight, textHeight + 10);
    });

    if (doc.y + rowHeight > doc.page.height - 55) {
      doc.addPage();

      header();
    }

    const y = doc.y;

    if (index % 2 === 1) {
      doc.rect(MARGIN, y, totalWidth, rowHeight).fill("#FAFAFA");
    }

    let x = MARGIN;

    columns.forEach((column) => {
      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#111827")
        .text(column.getValue(row), x + 4, y + 6, {
          width: column.width - 8,

          height: rowHeight - 8,

          ellipsis: true,
        });

      x += column.width;
    });

    doc
      .strokeColor("#E5E7EB")
      .lineWidth(0.5)
      .moveTo(MARGIN, y + rowHeight)
      .lineTo(MARGIN + totalWidth, y + rowHeight)
      .stroke();

    doc.y = y + rowHeight;
  });
}

function auditStatus(issues: number) {
  if (issues === 0) {
    return "SEM DIVERGENCIAS DETECTADAS";
  }

  return `${issues} DIVERGENCIA(S) DETECTADA(S)`;
}

export function createStoreAuditPdf(report: StoreAuditReport) {
  const stream = new PassThrough();

  const doc = new PDFDocument({
    size: "A4",

    margins: {
      top: MARGIN,

      bottom: 50,

      left: MARGIN,

      right: MARGIN,
    },

    bufferPages: true,

    info: {
      Title: `Auditoria IAki - ${report.store.name}`,

      Author: "Clube IAki",

      Subject: "Relatorio de auditoria operacional e conferencia de dados",
    },
  });

  doc.pipe(stream);

  /*
   * ============================
   * CAPA / CABEÇALHO
   * ============================
   */

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#4C1D95")
    .text("Clube IAki");

  doc.fontSize(16).fillColor("#111827").text("Relatorio de Auditoria da Loja");

  doc
    .moveDown(0.3)
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Documento para conferencia operacional, backup e restauracao dos dados da loja.",
    );

  /*
   * ============================
   * IDENTIFICAÇÃO
   * ============================
   */

  sectionTitle(doc, "Identificacao");

  keyValue(doc, "Loja", report.store.name);

  keyValue(doc, "ID da loja", report.store.id);

  keyValue(doc, "CNPJ", report.store.cnpj ?? "Nao informado");

  keyValue(doc, "Localidade", `${report.store.city} - ${report.store.state}`);

  keyValue(doc, "Loja ativa", report.store.isActive ? "Sim" : "Nao");

  keyValue(doc, "Cadastro da loja", formatDate(report.store.createdAt));

  keyValue(doc, "Relatorio gerado", formatDate(report.generatedAt));

  keyValue(
    doc,
    "Gerado por",
    report.generatedBy
      ? `${report.generatedBy.name} - ${report.generatedBy.email}`
      : "Administrador nao identificado",
  );

  keyValue(
    doc,
    "Periodo",
    report.period.from || report.period.to
      ? `${formatDate(report.period.from)} ate ${formatDate(report.period.to)}`
      : "Todo o historico",
  );

  /*
   * ============================
   * PLANO
   * ============================
   */

  sectionTitle(doc, "Plano e assinatura");

  if (report.subscription) {
    keyValue(doc, "Plano", report.subscription.plan.name);

    keyValue(doc, "Valor", formatMoney(report.subscription.plan.price));

    keyValue(doc, "Status", report.subscription.status);

    keyValue(
      doc,
      "Periodo",
      `${formatDate(report.subscription.startDate)} ate ${formatDate(
        report.subscription.endDate,
      )}`,
    );

    keyValue(doc, "Trial", report.subscription.isTrial ? "Sim" : "Nao");
  } else {
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#6B7280")
      .text("Nenhuma assinatura encontrada.");
  }

  /*
   * ============================
   * RESUMO
   * ============================
   */

  sectionTitle(doc, "Resumo operacional");

  keyValue(doc, "Clientes relacionados", report.summary.customers.total);

  keyValue(
    doc,
    "Pedidos",
    `${report.summary.orders.total} total | ${report.summary.orders.validated} validados | ${report.summary.orders.pending} pendentes | ${report.summary.orders.expired} expirados`,
  );

  keyValue(
    doc,
    "Valor dos pedidos",
    formatMoney(report.summary.orders.totalAmount),
  );

  keyValue(
    doc,
    "Valor validado",
    formatMoney(report.summary.orders.validatedAmount),
  );

  keyValue(doc, "Pontos esperados", report.summary.orders.pointsExpected);

  keyValue(doc, "Pontos creditados", report.summary.orders.pointsCredited);

  keyValue(doc, "Saldo atual", `${report.summary.wallets.balance} pontos`);

  keyValue(doc, "Total acumulado", `${report.summary.wallets.earned} pontos`);

  keyValue(doc, "Total utilizado", `${report.summary.wallets.spent} pontos`);

  keyValue(
    doc,
    "Brindes",
    `${report.summary.rewards.total} cadastrados | ${report.summary.rewards.active} ativos | estoque ${report.summary.rewards.stock}`,
  );

  keyValue(
    doc,
    "Resgates",
    `${report.summary.redemptions.total} total | ${report.summary.redemptions.confirmed} confirmados | ${report.summary.redemptions.pending} pendentes | ${report.summary.redemptions.canceled} cancelados`,
  );

  keyValue(
    doc,
    "Produtos",
    `${report.summary.products.total} cadastrados | ${report.summary.products.active} ativos | estoque total ${report.summary.products.stock}`,
  );

  /*
   * ============================
   * INTEGRIDADE
   * ============================
   */

  sectionTitle(doc, "Conferencia de integridade");

  const clean = report.integrity.totalIssues === 0;

  doc
    .roundedRect(MARGIN, doc.y, CONTENT_WIDTH, 34, 5)
    .fill(clean ? "#ECFDF5" : "#FEF2F2");

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(clean ? "#047857" : "#B91C1C")
    .text(auditStatus(report.integrity.totalIssues), MARGIN + 10, doc.y - 25, {
      width: CONTENT_WIDTH - 20,
    });

  doc.moveDown(1.5);

  keyValue(doc, "Pontos divergentes", report.integrity.pointMismatchOrders);

  keyValue(doc, "EARN duplicado", report.integrity.duplicateEarnOrders);

  keyValue(
    doc,
    "Pedido nao validado com pontos",
    report.integrity.nonValidatedWithPoints,
  );

  keyValue(
    doc,
    "Validado sem validatedAt",
    report.integrity.validatedWithoutDate,
  );

  keyValue(doc, "Carteiras negativas", report.integrity.negativeWallets);

  keyValue(
    doc,
    "Carteiras inconsistentes",
    report.integrity.inconsistentWallets,
  );

  keyValue(
    doc,
    "Resgate confirmado sem usedAt",
    report.integrity.confirmedWithoutUsedAt,
  );

  keyValue(
    doc,
    "Resgate pendente com usedAt",
    report.integrity.pendingWithUsedAt,
  );

  keyValue(
    doc,
    "Estoque negativo de brindes",
    report.integrity.negativeRewardStock,
  );

  keyValue(
    doc,
    "Estoque negativo de produtos",
    report.integrity.negativeProductStock,
  );

  /*
   * ============================
   * PEDIDOS
   * ============================
   */

  sectionTitle(doc, "Pedidos e validacoes");

  drawTable(
    doc,
    [
      {
        title: "Pedido",

        width: 60,

        getValue: (item) => shortId(item.id),
      },

      {
        title: "Data",

        width: 72,

        getValue: (item) => formatDate(item.createdAt),
      },

      {
        title: "Cliente",

        width: 110,

        getValue: (item) => item.userName,
      },

      {
        title: "Status",

        width: 68,

        getValue: (item) => item.status,
      },

      {
        title: "Valor",

        width: 72,

        getValue: (item) => formatMoney(item.totalAmount),
      },

      {
        title: "Prev.",

        width: 55,

        getValue: (item) => String(item.expectedPoints),
      },

      {
        title: "Credit.",

        width: 55,

        getValue: (item) => String(item.pointsCredited),
      },
    ],
    report.orders,
  );

  /*
   * ============================
   * CARTEIRAS
   * ============================
   */

  sectionTitle(doc, "Carteiras de pontos");

  drawTable(
    doc,
    [
      {
        title: "Usuario",

        width: 65,

        getValue: (item) => shortId(item.userId),
      },

      {
        title: "Cliente",

        width: 180,

        getValue: (item) => item.userName,
      },

      {
        title: "Saldo",

        width: 65,

        getValue: (item) => String(item.balance),
      },

      {
        title: "Ganho",

        width: 65,

        getValue: (item) => String(item.earned),
      },

      {
        title: "Usado",

        width: 65,

        getValue: (item) => String(item.spent),
      },

      {
        title: "Atualizado",

        width: 75,

        getValue: (item) => formatDate(item.updatedAt),
      },
    ],
    report.wallets,
  );

  /*
   * ============================
   * EXTRATO
   * ============================
   */

  sectionTitle(doc, "Extrato de pontos");

  drawTable(
    doc,
    [
      {
        title: "Data",

        width: 75,

        getValue: (item) => formatDate(item.createdAt),
      },

      {
        title: "Tipo",

        width: 50,

        getValue: (item) => item.type,
      },

      {
        title: "Cliente",

        width: 120,

        getValue: (item) => item.userName,
      },

      {
        title: "Pts",

        width: 45,

        getValue: (item) => String(item.points),
      },

      {
        title: "Pedido",

        width: 65,

        getValue: (item) => shortId(item.orderId),
      },

      {
        title: "Observacao",

        width: 160,

        getValue: (item) => item.note ?? "-",
      },
    ],
    report.transactions,
  );

  /*
   * ============================
   * BRINDES
   * ============================
   */

  sectionTitle(doc, "Brindes cadastrados");

  drawTable(
    doc,
    [
      {
        title: "Codigo",

        width: 65,

        getValue: (item) => shortId(item.id),
      },

      {
        title: "Brinde",

        width: 205,

        getValue: (item) => item.title,
      },

      {
        title: "Pontos",

        width: 65,

        getValue: (item) => String(item.pointsCost),
      },

      {
        title: "Estoque",

        width: 65,

        getValue: (item) => String(item.stock),
      },

      {
        title: "Ativo",

        width: 55,

        getValue: (item) => (item.isActive ? "Sim" : "Nao"),
      },

      {
        title: "Validade",

        width: 60,

        getValue: (item) => formatDate(item.expiresAt),
      },
    ],
    report.rewards,
  );

  /*
   * ============================
   * RESGATES
   * ============================
   */

  sectionTitle(doc, "Resgates de brindes");

  drawTable(
    doc,
    [
      {
        title: "Codigo",

        width: 65,

        getValue: (item) => shortId(item.id),
      },

      {
        title: "Data",

        width: 75,

        getValue: (item) => formatDate(item.createdAt),
      },

      {
        title: "Cliente",

        width: 115,

        getValue: (item) => item.userName,
      },

      {
        title: "Brinde",

        width: 125,

        getValue: (item) => item.rewardTitle,
      },

      {
        title: "Pts",

        width: 50,

        getValue: (item) => String(item.points),
      },

      {
        title: "Status",

        width: 85,

        getValue: (item) => item.status,
      },
    ],
    report.redemptions,
  );

  /*
   * ============================
   * PRODUTOS
   * ============================
   */

  sectionTitle(doc, "Produtos e estoque");

  drawTable(
    doc,
    [
      {
        title: "Codigo",

        width: 65,

        getValue: (item) => shortId(item.id),
      },

      {
        title: "Produto",

        width: 210,

        getValue: (item) => item.name,
      },

      {
        title: "Preco",

        width: 80,

        getValue: (item) => formatMoney(item.price),
      },

      {
        title: "Estoque",

        width: 60,

        getValue: (item) => String(item.quantity),
      },

      {
        title: "Min.",

        width: 50,

        getValue: (item) => String(item.minStock),
      },

      {
        title: "Ativo",

        width: 50,

        getValue: (item) => (item.status ? "Sim" : "Nao"),
      },
    ],
    report.products,
  );

  /*
   * ============================
   * DIVERGÊNCIAS
   * ============================
   */

  if (report.integrity.details.pointMismatchOrders.length > 0) {
    sectionTitle(doc, "Detalhes - divergencia de pontos");

    drawTable(
      doc,
      [
        {
          title: "Pedido",

          width: 100,

          getValue: (item) => shortId(item.orderId),
        },

        {
          title: "Valor",

          width: 110,

          getValue: (item) => formatMoney(item.totalAmount),
        },

        {
          title: "Esperado",

          width: 100,

          getValue: (item) => String(item.expectedPoints),
        },

        {
          title: "Creditado",

          width: 100,

          getValue: (item) => String(item.creditedPoints),
        },

        {
          title: "Diferenca",

          width: 105,

          getValue: (item) => String(item.difference),
        },
      ],
      report.integrity.details.pointMismatchOrders,
    );
  }

  /*
   * ============================
   * FINGERPRINT
   * ============================
   */

  sectionTitle(doc, "Assinatura de auditoria");

  keyValue(doc, "Versao", report.auditVersion);

  keyValue(doc, "Algoritmo", "SHA-256");

  ensureSpace(doc, 60);

  doc
    .font("Courier")
    .fontSize(8)
    .fillColor("#111827")
    .text(report.fingerprint, {
      width: CONTENT_WIDTH,
    });

  doc
    .moveDown(0.5)
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#6B7280")
    .text(
      "Relatorios gerados sobre exatamente o mesmo estado de dados e utilizando a mesma versao de auditoria devem produzir o mesmo fingerprint.",
    );

  /*
   * ============================
   * UUIDs COMPLETOS
   * ============================
   */

  sectionTitle(doc, "Referencias tecnicas");

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#374151")
    .text(`ID completo da loja: ${report.store.id}`);

  doc.moveDown(0.5);

  report.orders.forEach((order) => {
    ensureSpace(doc, 16);

    doc.text(`Pedido ${shortId(order.id)}: ${order.id}`);
  });

  report.redemptions.forEach((redemption) => {
    ensureSpace(doc, 16);

    doc.text(`Resgate ${shortId(redemption.id)}: ${redemption.id}`);
  });

  /*
   * ============================
   * RODAPÉ
   * ============================
   */

  const pageRange = doc.bufferedPageRange();

  for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
    doc.switchToPage(i);

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#9CA3AF")
      .text(
        `Clube IAki | Auditoria ${report.auditVersion} | Pagina ${
          i - pageRange.start + 1
        } de ${pageRange.count}`,
        MARGIN,
        doc.page.height - 30,
        {
          width: CONTENT_WIDTH,

          align: "center",
        },
      );
  }

  doc.end();

  return stream;
}
