"""Update models

Revision ID: c0f2af6f4097
Revises: 69118b793f34
Create Date: 2025-06-22 17:37:18.224617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c0f2af6f4097'
down_revision = '69118b793f34'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('skills')
    op.drop_table('skill_requests')
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(), nullable=False),
    sa.Column('email', sa.VARCHAR(), nullable=False),
    sa.Column('password_hash', sa.VARCHAR(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('skill_requests',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('requester_id', sa.INTEGER(), nullable=True),
    sa.Column('skill_id', sa.INTEGER(), nullable=True),
    sa.Column('status', sa.VARCHAR(), nullable=True),
    sa.Column('message', sa.VARCHAR(), nullable=True),
    sa.ForeignKeyConstraint(['requester_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('skills',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('title', sa.VARCHAR(), nullable=False),
    sa.Column('description', sa.VARCHAR(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
