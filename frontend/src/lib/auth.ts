import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { checkout, polar, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { db } from "~/server/db";

const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
});

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 

    
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "cc2fb2ad-deeb-43ca-999e-9e718e7acd77",
                            slug: "small"
                        },
                    

                        {
                            productId: "999e1bac-cbda-4511-b31f-e37b4b64337c",
                            slug: "medium"
                        },
                    
                        
                        {
                            productId: "d51f2f7b-82a4-437e-8572-20ad73197bea",
                            slug: "large"
                        },
                    ],
                    successUrl:"/dashboard",
                    authenticatedUsersOnly: true,
                }),
            
                portal(),
                usage(),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    onOrderPaid: async(order) => {
                        const externalCustomerId=order.data.customer.externalId;

                        if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "cc2fb2ad-deeb-43ca-999e-9e718e7acd77":
                creditsToAdd = 50;
                break;
              case "999e1bac-cbda-4511-b31f-e37b4b64337c":
                creditsToAdd = 200;
                break;
              case "d51f2f7b-82a4-437e-8572-20ad73197bea":
                creditsToAdd = 400;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});